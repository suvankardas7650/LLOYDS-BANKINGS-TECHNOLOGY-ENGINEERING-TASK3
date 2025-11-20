import React, { useMemo, useState } from "react";

type LoanTermOption = {
  label: string;
  years: number;
};

const LOAN_TERMS: LoanTermOption[] = [
  { label: "15 years (fix)", years: 15 },
  { label: "20 years (fix)", years: 20 },
  { label: "30 years (fix)", years: 30 },
];

const DEFAULT_PURCHASE_PRICE = 990000;
const DEFAULT_DOWN_PAYMENT = 22002;
const DEFAULT_RATE = 4.264;
const DEFAULT_TERM = LOAN_TERMS[1];

const HOMEOWNERS_INSURANCE = 80;
const PROPERTY_TAX = 1300;

function calculateMonthlyPrincipalAndInterest(
  purchasePrice: number,
  downPayment: number,
  annualRatePercent: number,
  years: number
): number {
  const loanAmount = Math.max(purchasePrice - downPayment, 0);
  if (loanAmount === 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;
  const n = years * 12;

  if (monthlyRate === 0) {
    return loanAmount / n;
  }

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, n);
  const denominator = Math.pow(1 + monthlyRate, n) - 1;
  return loanAmount * (numerator / denominator);
}

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const App: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(
    DEFAULT_PURCHASE_PRICE
  );
  const [downPayment, setDownPayment] = useState<number>(DEFAULT_DOWN_PAYMENT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [term, setTerm] = useState<LoanTermOption>(DEFAULT_TERM);

  const principalAndInterest = useMemo(
    () =>
      calculateMonthlyPrincipalAndInterest(
        purchasePrice,
        downPayment,
        rate,
        term.years
      ),
    [purchasePrice, downPayment, rate, term]
  );

  const totalPayment = principalAndInterest + HOMEOWNERS_INSURANCE + PROPERTY_TAX;

  return (
    <div className="page">
      <header className="topbar">
        <div className="logo">Mortgage</div>
        <nav className="nav">
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            About Mortgage
          </a>
          <a href="#" className="nav-link nav-link--active">
            Calculator
          </a>
          <a href="#" className="nav-link">
            Contact us
          </a>
          <a href="#" className="nav-link">
            FAQs
          </a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-heading">
            <h1>
              Your Dream Home Starts with the Right Numbers,
              <br />
              your Mortgage{" "}
              <span className="hero-highlight">Simplified and Solved</span>
            </h1>
            <p className="hero-subtitle">
              Apply for your mortgage in just a few steps — tweak numbers to see
              your monthly payment.
            </p>
          </div>

          <div className="grid">
            {/* Left: Inputs */}
            <div className="card">
              <h2 className="card-title">Purchase Price</h2>
              <div className="slider-row">
                <input
                  type="range"
                  min={50000}
                  max={4000000}
                  value={purchasePrice}
                  onChange={(e) =>
                    setPurchasePrice(
                      Number.isNaN(Number(e.target.value))
                        ? 0
                        : Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) =>
                      setPurchasePrice(
                        Number.isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="range-labels">
                  <span>$50,000 -</span>
                  <span>$4,000,000</span>
                </div>
              </div>

              <div className="field-row mt">
                <div className="field">
                  <label>Down Payment</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) =>
                      setDownPayment(
                        Number.isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                  />
                  <small className="hint">
                    Suggested: at least 10% of purchase price
                  </small>
                </div>
                <div className="field field--small">
                  <label>&nbsp;</label>
                  <div className="percent-box">2%</div>
                </div>
              </div>

              <div className="field-row mt">
                <div className="field">
                  <label>Length of loan</label>
                  <select
                    value={term.years}
                    onChange={(e) => {
                      const years = Number(e.target.value);
                      const selected = LOAN_TERMS.find(
                        (t) => t.years === years
                      );
                      setTerm(selected || DEFAULT_TERM);
                    }}
                  >
                    {LOAN_TERMS.map((option) => (
                      <option key={option.years} value={option.years}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Interest rate (%)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={rate}
                    onChange={(e) =>
                      setRate(
                        Number.isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <p className="tip">
                Tip: Lower rates or larger down payment reduce monthly EMI.
              </p>
            </div>

            {/* Center: Result */}
            <div className="card card--accent">
              <h2 className="card-title centered">Estimated Monthly Payment</h2>
              <p className="payment-amount">{formatCurrency(totalPayment)}</p>
              <ul className="breakdown">
                <li>
                  <span>Principal &amp; interest</span>
                  <span>{formatCurrency(principalAndInterest)}</span>
                </li>
                <li>
                  <span>Homeowners insurance</span>
                  <span>{formatCurrency(HOMEOWNERS_INSURANCE)}</span>
                </li>
                <li>
                  <span>Property tax</span>
                  <span>{formatCurrency(PROPERTY_TAX)}</span>
                </li>
              </ul>
              <button className="primary-btn">Get Started</button>
              <div className="loan-meta">
                <div>
                  <span className="meta-label">Loan amount:</span>{" "}
                  {formatCurrency(Math.max(purchasePrice - downPayment, 0))}
                </div>
                <div>
                  <span className="meta-label">Term:</span> {term.years} years
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="card">
              <h2 className="card-title">What to do next?</h2>

              <div className="action-card">
                <div>
                  <p className="action-title">
                    Get preapproved for our mortgage
                  </p>
                  <p className="action-text">
                    Check how much you can borrow based on your profile.
                  </p>
                </div>
                <button className="secondary-btn">Start</button>
              </div>

              <div className="action-card">
                <div>
                  <p className="action-title">Find a real estate agent</p>
                  <p className="action-text">
                    Connect with trusted agents in your area.
                  </p>
                </div>
                <button className="secondary-btn">Search</button>
              </div>

              <div className="action-card">
                <div>
                  <p className="action-title">Learn more about mortgage</p>
                  <p className="action-text">
                    Explore FAQs, guides, and expert tips.
                  </p>
                </div>
                <button className="secondary-btn">Read</button>
              </div>

              <div className="illustration">
                <span role="img" aria-label="illustration">
                  🏡
                </span>
                <span>illustration</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
