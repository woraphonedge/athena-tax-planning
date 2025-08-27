# Fan Chart for Portfolio Projections

This README explains (1) **what a fan chart is**, (2) **how we construct it** for a portfolio built from an **end-of-year annuity** and a **one-time lump sum deposited at the end of a chosen year**, and (3) **why moment matching is needed for the annuity** component.

---

## What is a fan chart?

A **fan chart** visualizes the **distribution of possible portfolio values over time**. Instead of a single path, you see percentiles (e.g., 5th/25th/50th/75th/95th) at each year. The bands widen as uncertainty accumulates.

We support two components:

- **Annuity**: invest `C` at the **end** of each year `1..N`.
- **Lump sum**: invest `L` at the **end of year `y = L_year_end`** (so it compounds for `N - y` years).

---

## Model at a glance

Per-year simple return is a random variable. We use two compatible approaches:

1. **Monte Carlo (MC)**: simulate yearly returns, grow the portfolio path, and read off percentiles per year. Stochastic, but accurate and path-aware.

2. **Semi-analytical (deterministic)**:
   - Compute **first two moments** (mean and variance) of each component’s terminal value.
   - Approximate each component by a **lognormal** $LogN(μ, σ)$ via **Fenton–Wilkinson moment matching**.
   - Combine components using **comonotonic coupling (ρ = 1)**: evaluate both components at the **same** standard normal shock $Z$, then **add**. This yields valid, deterministic percentiles for the **sum** (and is conservative/wider than assuming independence).

> Why comonotonic coupling? The annuity and the lump are driven by the **same market returns**, so they are **positively correlated**. Using the same $Z$ enforces perfect positive dependence and avoids the common but incorrect “sum of separate quantiles” trick.

---

## Timing conventions (important)

- **Annuity:** `C` added *after* the year’s return (ordinary annuity).
- **Lump sum:** `L` added at **end of year `L_year_end`**.
  - If `L_year_end = 1`, `L` compounds for `N − 1` years.
  - If `L_year_end = N`, `L` is deposited at the horizon (no compounding).
  - If `L_year_end > N`, it contributes `0` within the horizon.

Keep these consistent across MC and semi-analytical approaches.

---

## Why moment matching is needed for the annuity

The annuity’s terminal value is

$$
W_N = C·G_N + C·G_{N-1} + … + C·G_2 + C
$$

where $G_k = Π_{t=k..N} (1 + R_t)$ is the product of random gross returns from year $k$ to $N$. This is a **sum of correlated products of random variables**. There is **no simple closed-form distribution** for $W_N$.

However, we **can** derive its **mean** and **second moment**, then **fit** a lognormal approximation that matches those two moments:

- Define:
  - $m = E[1 + R]$
  - $A = E[(1 + R)^2]$
- Then (under IID returns):
  - **Mean**
    - If $μ = E[R] ≈ m − 1 ≠ 0$:  
      $$E[W_N] = C · (m^N − 1) / (m − 1)$$
    - If $μ = 0$: $E[W_N] = C · N$
  - **Second moment**  
    Let  
    $$
    S = (A^N − 1) / (A − 1)
    $$
    $$
    T = Σ_{p=1}^{N-1} m^p · (A^{N−p} − 1) / (A − 1)
    $$
    Then  
    $$
    E[W_N^2] = C^2 · (S + 2T)
    $$
  - **Variance**  
    $$
    Var(W_N) = E[W_N^2] − (E[W_N])^2
    $$

Finally, map $(E, Var)$ to lognormal parameters:

$$
σ_W^2 = ln(1 + Var / E^2)
μ_W   = ln(E) − ½·σ_W^2
$$

and approximate $W_N ≈ LogN(μ_W, σ_W)$.

> This **moment matching** is the key step that makes the annuity tractable without simulation. It captures both level and dispersion correctly to first order.

### Lump sum moments (end-of-year deposit)

If $L$ is deposited **at the end of year $y$**, it compounds for $nL = max(0, N − y)$ years. Using the same $m$ and $A$:

$$
E[L_N]     = L · m^{nL}
$$
$$
E[L_N^2]   = L^2 · A^{nL}
$$
$$
Var(L_N)   = E[L_N^2] − (E[L_N])^2
$$

Then moment-match to $LogN(μ_L, σ_L)$ exactly as above.

---

## Combining annuity + lump: comonotonic percentiles

Treat the annuity and lump as **lognormals** with parameters $(μ_A, σ_A)$ and $(μ_L, σ_L)$. For a percentile $p$ with $z = Φ⁻¹(p)$:

$$ Q_total(p) = exp(μ_A + σ_A·z) + exp(μ_L + σ_L·z) $$

This uses the **same** $z$ for both components (ρ=1). Because $Q_total(p)$ is monotone in $z$, this is a **valid** percentile for the **sum** (not merely an approximation by adding independent quantiles).

- **Median (p=50%)**: use $z=0$  
  $$Median_total = exp(μ_A) + exp(μ_L)$$
- If you also want the **mean** of the total, report $E[W_N] + E[L_N]$ directly from the moments (don’t use the lognormal mean unless you intend to).

---

## Choosing the per-year return model

- **Arithmetic-normal simple returns**:  
  Use $m = 1 + μ$, $A = m^2 + σ^2$. Note $(1 + R)$ can be ≤ 0; the model allows severe drawdowns.  
- **Lognormal gross returns** (recommended for positivity):  
  If $ln(gross)$ ~ $N(μ_ℓ − ½σ_ℓ², σ_ℓ²)$, then  
  $m = E[gross] = exp(μ_ℓ)$ and $A = E[gross²] = exp(2μ_ℓ + σ_ℓ²)$.  
  Plug these $m$ and $A$ into the same moment formulas above.

> For apples-to-apples MC vs. semi-analytical comparisons, ensure **both** use the **same** per-year return model (arithmetic-normal or lognormal) and the **same timing** for deposits.

---

## Minimal pseudo-code

```python
# 1) Compute m and A from your per-year return model
#    - arithmetic-normal: m = 1 + mu, A = m**2 + sigma**2
#    - lognormal-gross:   m = exp(mu_l), A = exp(2*mu_l + sigma_l**2)

# 2) Annuity moments (ordinary annuity, end-of-year C)
E_ann = C * (m**N - 1) / (m - 1) if abs(m - 1) > 1e-14 else C*N
S = (A**N - 1) / (A - 1)
T = sum(m**p * (A**(N - p) - 1) / (A - 1) for p in range(1, N))
Var_ann = C**2 * (S + 2*T) - E_ann**2

# 3) Lump moments (deposit at end of year y = L_year_end)
nL = max(0, N - L_year_end)
E_lump = L * (m**nL)
Var_lump = L**2 * (A**nL) - E_lump**2

# 4) Moment-match each to LogN
muA = ln(E_ann) - 0.5*ln(1 + Var_ann/E_ann**2);  sigmaA = sqrt(ln(1 + Var_ann/E_ann**2))
muL = ln(E_lump) - 0.5*ln(1 + Var_lump/E_lump**2);sigmaL = sqrt(ln(1 + Var_lump/E_lump**2))

# 5) Comonotonic percentile for p in (0,1)
z = Phi^{-1}(p)
Q_total(p) = exp(muA + sigmaA*z) + exp(muL + sigmaL*z)
```

---

## Validation & sanity checks

- **σ = 0** ⇒ all bands collapse to deterministic FV (both components).  
- **C = 0** or **L = 0** ⇒ reduces to the single-component case.  
- **Higher σ** ⇒ wider fan bands (monotonic).  
- Compare to **Monte Carlo** built on the **same model** and **timing**. Expect close alignment; MC can be slightly higher due to path convexity that a one-shock lognormal fit can’t fully capture.

---

## Common pitfalls (and how we avoid them)

- ❌ **Adding quantiles of components computed independently** → invalid for the sum.  
  ✅ We use **shared $z(ρ=1)$ so $Q_total(p)$ is a proper quantile.

- ❌ **Mixing models** (MC lognormal vs. moments from arithmetic-normal).  
  ✅ Keep $m$ and $A$ consistent across both methods.

- ❌ **Wrong timing** (treating $L$ as t=0 while annuity is end-of-year).  
  ✅ We parameterize `L_year_end` and compound $L$ for exactly `N − L_year_end` years.

---

## When to use which method

- **Semi-analytical (this README):** deterministic, extremely fast, great for client-side fan charts and sliders.
- **Monte Carlo:** best for validation, stress testing, exotic cash-flow schedules, and when you need full path-dependent metrics.

---
