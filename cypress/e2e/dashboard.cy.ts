describe("Dashboard", () => {
  beforeEach(() => {
    // Mock authentication - in real tests, you'd set up proper auth
    cy.visit("/dashboard")
  })

  it("should display dashboard overview", () => {
    cy.contains("Dashboard")
    cy.contains("Total Tokens")
    cy.contains("KYC Verifications")
    cy.contains("Transactions")
    cy.contains("Success Rate")
  })

  it("should navigate to tokenization module", () => {
    cy.contains("Tokenization").click()
    cy.url().should("include", "/dashboard/tokenization")
    cy.contains("Create New Digital Asset")
  })

  it("should navigate to compliance module", () => {
    cy.contains("Compliance").click()
    cy.url().should("include", "/dashboard/compliance")
    cy.contains("Compliance & KYC")
  })

  it("should display module cards", () => {
    cy.get('[data-testid="module-card"]').should("have.length.at.least", 2)
    cy.contains("Tokenization")
    cy.contains("Compliance & KYC")
  })
})
