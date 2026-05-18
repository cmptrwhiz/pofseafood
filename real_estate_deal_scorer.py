from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def ratio_score(value: float, floor: float, target: float) -> float:
    if target <= floor:
        return 100.0 if value >= target else 0.0
    scaled = (value - floor) / (target - floor)
    return clamp(scaled * 100.0, 0.0, 100.0)


@dataclass
class OperatingExpenses:
    taxes: float = 0.0
    insurance: float = 0.0
    repairs: float = 0.0
    payroll: float = 0.0
    utilities: float = 0.0
    management: float = 0.0
    admin: float = 0.0
    hoa: float = 0.0
    other: float = 0.0

    @property
    def total(self) -> float:
        return (
            self.taxes
            + self.insurance
            + self.repairs
            + self.payroll
            + self.utilities
            + self.management
            + self.admin
            + self.hoa
            + self.other
        )


@dataclass
class FinancingTerms:
    annual_debt_service: float
    interest_rate: float
    amortization_years: int = 30
    loan_to_value: float = 0.75


@dataclass
class RiskFactors:
    market_cap_rate: float
    cap_rate_expansion_bps: int = 75
    tax_reset_rate: float = 0.0125
    insurance_rate: float = 0.0035
    repair_reserve_rate: float = 0.05
    management_fee_rate: float = 0.08
    vacancy_rate: float = 0.05
    stress_interest_rate_increase: float = 0.015
    stress_noi_haircut: float = 0.10
    tenant_quality: int = 7
    location_quality: int = 7
    market_volatility: int = 5
    deferred_maintenance: int = 4
    tenant_concentration: int = 3
    regulatory_risk: int = 3
    liquidity_risk: int = 4
    value_add_potential: int = 6
    rent_growth_potential: int = 5


@dataclass
class DealInput:
    purchase_price: float
    annual_gross_rent: float
    expenses: OperatingExpenses
    financing: FinancingTerms
    risk_factors: RiskFactors
    other_income: float = 0.0


@dataclass
class ScoreBreakdown:
    downside_protection: float
    income_strength: float
    pricing_inefficiency: float
    risk: float
    upside: float

    @property
    def overall(self) -> float:
        return round(
            self.downside_protection * 0.35
            + self.income_strength * 0.25
            + self.pricing_inefficiency * 0.15
            + self.risk * 0.15
            + self.upside * 0.10,
            1,
        )


@dataclass
class DealAnalysis:
    purchase_price: float
    adjusted_noi: float
    cap_rate: float
    dscr: float
    stress_tested_dscr: float
    true_value: float
    discount_to_true_value: float
    offer_range: Dict[str, float]
    decision: str
    risk_summary: str
    strategy_recommendation: str
    score_breakdown: ScoreBreakdown
    adjusted_expense_details: Dict[str, float] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["score"] = self.score_breakdown.overall
        return data


class RealEstateDealScorer:
    def analyze(self, deal: DealInput) -> DealAnalysis:
        adjusted_expenses = self._adjust_expenses(deal)
        effective_income = deal.annual_gross_rent + deal.other_income
        adjusted_noi = effective_income - sum(adjusted_expenses.values())
        cap_rate = adjusted_noi / deal.purchase_price if deal.purchase_price else 0.0
        dscr = (
            adjusted_noi / deal.financing.annual_debt_service
            if deal.financing.annual_debt_service
            else 0.0
        )

        stressed_noi = adjusted_noi * (1.0 - deal.risk_factors.stress_noi_haircut)
        stress_debt_service = deal.financing.annual_debt_service * (
            1.0
            + deal.risk_factors.stress_interest_rate_increase
            / max(deal.financing.interest_rate, 0.01)
            * 0.6
        )
        stress_tested_dscr = stressed_noi / stress_debt_service if stress_debt_service else 0.0

        exit_cap_rate = deal.risk_factors.market_cap_rate + (
            deal.risk_factors.cap_rate_expansion_bps / 10000.0
        )
        true_value = adjusted_noi / exit_cap_rate if exit_cap_rate else 0.0
        discount = (
            (true_value - deal.purchase_price) / true_value if true_value > 0 else -1.0
        )

        score_breakdown = self._score_deal(
            deal=deal,
            adjusted_noi=adjusted_noi,
            cap_rate=cap_rate,
            dscr=dscr,
            stress_tested_dscr=stress_tested_dscr,
            discount=discount,
        )

        risk_penalty = (100.0 - score_breakdown.risk) / 100.0
        max_buffer = 0.05 + risk_penalty * 0.05
        target_buffer = max_buffer + 0.04 + risk_penalty * 0.03
        anchor_buffer = target_buffer + 0.05 + risk_penalty * 0.03

        max_offer = max(true_value * (1.0 - max_buffer), 0.0)
        target_offer = max(true_value * (1.0 - target_buffer), 0.0)
        anchor_offer = max(true_value * (1.0 - anchor_buffer), 0.0)

        decision = self._decision(score_breakdown.overall, stress_tested_dscr, discount)
        risk_summary = self._risk_summary(deal, dscr, stress_tested_dscr, discount)
        strategy = self._strategy_recommendation(
            decision=decision,
            dscr=dscr,
            stress_tested_dscr=stress_tested_dscr,
            discount=discount,
            risk_score=score_breakdown.risk,
        )

        return DealAnalysis(
            purchase_price=round(deal.purchase_price, 2),
            adjusted_noi=round(adjusted_noi, 2),
            cap_rate=round(cap_rate, 4),
            dscr=round(dscr, 3),
            stress_tested_dscr=round(stress_tested_dscr, 3),
            true_value=round(true_value, 2),
            discount_to_true_value=round(discount, 4),
            offer_range={
                "anchor": round(min(anchor_offer, target_offer, max_offer), 2),
                "target": round(min(max(anchor_offer, target_offer), max_offer), 2),
                "max": round(max_offer, 2),
            },
            decision=decision,
            risk_summary=risk_summary,
            strategy_recommendation=strategy,
            score_breakdown=score_breakdown,
            adjusted_expense_details={k: round(v, 2) for k, v in adjusted_expenses.items()},
        )

    def _adjust_expenses(self, deal: DealInput) -> Dict[str, float]:
        rents = deal.annual_gross_rent + deal.other_income
        expenses = deal.expenses
        risk = deal.risk_factors

        taxes = max(expenses.taxes, deal.purchase_price * risk.tax_reset_rate)
        insurance = max(expenses.insurance, deal.purchase_price * risk.insurance_rate)
        repairs = max(expenses.repairs, rents * risk.repair_reserve_rate)
        management = max(expenses.management, rents * risk.management_fee_rate)
        vacancy = rents * risk.vacancy_rate

        return {
            "taxes": taxes,
            "insurance": insurance,
            "repairs": repairs,
            "management": management,
            "vacancy": vacancy,
            "payroll": expenses.payroll,
            "utilities": expenses.utilities,
            "admin": expenses.admin,
            "hoa": expenses.hoa,
            "other": expenses.other,
        }

    def _score_deal(
        self,
        *,
        deal: DealInput,
        adjusted_noi: float,
        cap_rate: float,
        dscr: float,
        stress_tested_dscr: float,
        discount: float,
    ) -> ScoreBreakdown:
        rents = deal.annual_gross_rent + deal.other_income
        expense_ratio = 1.0 - (adjusted_noi / rents) if rents else 1.0
        risk = deal.risk_factors

        downside = (
            ratio_score(stress_tested_dscr, 0.90, 1.35) * 0.45
            + ratio_score(discount, -0.05, 0.20) * 0.35
            + ratio_score(cap_rate - risk.market_cap_rate, -0.01, 0.025) * 0.20
        )

        income_strength = (
            ratio_score(dscr, 1.0, 1.6) * 0.45
            + ratio_score(cap_rate, 0.04, 0.085) * 0.35
            + ratio_score(1.0 - expense_ratio, 0.30, 0.65) * 0.20
        )

        pricing_inefficiency = (
            ratio_score(discount, -0.03, 0.22) * 0.70
            + ratio_score(cap_rate - risk.market_cap_rate, -0.005, 0.02) * 0.30
        )

        raw_risk = (
            (10 - risk.tenant_quality) * 0.18
            + (10 - risk.location_quality) * 0.18
            + risk.market_volatility * 0.16
            + risk.deferred_maintenance * 0.16
            + risk.tenant_concentration * 0.12
            + risk.regulatory_risk * 0.10
            + risk.liquidity_risk * 0.10
        )
        risk_score = clamp(100.0 - raw_risk * 10.0, 0.0, 100.0)

        upside = (
            (risk.value_add_potential / 10.0) * 55.0
            + (risk.rent_growth_potential / 10.0) * 30.0
            + ratio_score(discount, -0.05, 0.20) * 0.15
        )

        return ScoreBreakdown(
            downside_protection=round(downside, 1),
            income_strength=round(income_strength, 1),
            pricing_inefficiency=round(pricing_inefficiency, 1),
            risk=round(risk_score, 1),
            upside=round(upside, 1),
        )

    def _decision(self, overall_score: float, stress_tested_dscr: float, discount: float) -> str:
        if overall_score >= 78 and stress_tested_dscr >= 1.15 and discount >= 0.10:
            return "buy"
        if overall_score >= 58 and stress_tested_dscr >= 1.0:
            return "watch"
        return "pass"

    def _risk_summary(
        self,
        deal: DealInput,
        dscr: float,
        stress_tested_dscr: float,
        discount: float,
    ) -> str:
        risk = deal.risk_factors
        issues: List[str] = []

        if stress_tested_dscr < 1.0:
            issues.append("stress coverage falls below break-even")
        if dscr < 1.2:
            issues.append("thin in-place debt coverage")
        if risk.deferred_maintenance >= 7:
            issues.append("elevated deferred maintenance")
        if risk.market_volatility >= 7:
            issues.append("volatile exit environment")
        if risk.tenant_concentration >= 7:
            issues.append("high tenant concentration")
        if discount < 0.05:
            issues.append("limited valuation cushion")

        if not issues:
            return "Risk is moderate and mostly operational; downside is buffered by cash flow and purchase discount."

        return "Key risks: " + ", ".join(issues) + "."

    def _strategy_recommendation(
        self,
        *,
        decision: str,
        dscr: float,
        stress_tested_dscr: float,
        discount: float,
        risk_score: float,
    ) -> str:
        if decision == "buy":
            return (
                "Pursue with a disciplined value offer, lock in diligence around taxes, insurance, "
                "and maintenance, and avoid bidding above the max offer unless debt terms improve."
            )
        if decision == "watch":
            if discount < 0.08:
                return (
                    "Track the deal and re-engage only if pricing softens; current economics do not "
                    "leave enough downside margin."
                )
            return (
                "Keep in the pipeline, tighten diligence, and negotiate credits or price cuts to push "
                "stress-tested coverage and margin of safety higher."
            )
        if stress_tested_dscr < 1.0 or risk_score < 55:
            return (
                "Pass unless the basis resets materially or a lower-risk capital structure is available; "
                "the current downside profile is too thin."
            )
        return "Pass for now and revisit only if the seller accepts a substantially lower basis."


def deal_from_dict(payload: Dict[str, Any]) -> DealInput:
    return DealInput(
        purchase_price=payload["purchase_price"],
        annual_gross_rent=payload["annual_gross_rent"],
        other_income=payload.get("other_income", 0.0),
        expenses=OperatingExpenses(**payload.get("expenses", {})),
        financing=FinancingTerms(**payload["financing"]),
        risk_factors=RiskFactors(**payload["risk_factors"]),
    )


def load_input(path: str | None) -> Dict[str, Any]:
    if path:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)

    return {
        "purchase_price": 1850000,
        "annual_gross_rent": 228000,
        "other_income": 12000,
        "expenses": {
            "taxes": 14800,
            "insurance": 5200,
            "repairs": 7500,
            "utilities": 9600,
            "admin": 2400,
            "other": 3800,
        },
        "financing": {
            "annual_debt_service": 118000,
            "interest_rate": 0.0675,
            "amortization_years": 30,
            "loan_to_value": 0.72,
        },
        "risk_factors": {
            "market_cap_rate": 0.0625,
            "cap_rate_expansion_bps": 100,
            "tax_reset_rate": 0.013,
            "insurance_rate": 0.0038,
            "repair_reserve_rate": 0.055,
            "management_fee_rate": 0.08,
            "vacancy_rate": 0.06,
            "stress_interest_rate_increase": 0.02,
            "stress_noi_haircut": 0.12,
            "tenant_quality": 7,
            "location_quality": 8,
            "market_volatility": 5,
            "deferred_maintenance": 4,
            "tenant_concentration": 3,
            "regulatory_risk": 4,
            "liquidity_risk": 5,
            "value_add_potential": 6,
            "rent_growth_potential": 5,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Score a real estate deal with a downside-first underwriting model."
    )
    parser.add_argument(
        "--input",
        help="Path to a JSON file containing deal inputs. If omitted, a sample deal is used.",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output.",
    )
    args = parser.parse_args()

    payload = load_input(args.input)
    deal = deal_from_dict(payload)
    analysis = RealEstateDealScorer().analyze(deal).to_dict()

    if args.pretty:
        print(json.dumps(analysis, indent=2, sort_keys=True))
    else:
        print(json.dumps(analysis))


if __name__ == "__main__":
    main()
