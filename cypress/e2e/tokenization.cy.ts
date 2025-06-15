describe("Tokenization Module", () => {
  beforeEach(() => {
    cy.visit("/dashboard/tokenization")
  })

  it("should display tokenization form", () => {
    cy.contains("Create New Digital Asset")
    cy.get("select").should("be.visible") // Asset type dropdown
    cy.get('input[placeholder*="asset name"]').should("be.visible")
    cy.get('input[type="number"]').should("be.visible") // Quantity
    cy.get("textarea").should("be.visible") // Description
  })

  it("should create a token with valid data", () => {
    // Mock API response
    cy.intercept("POST", "/api/tokenization", {
      statusCode: 200,
      body: {
        success: true,
        tx_hash: "0x123456789",
        token: { id: "token-123" },
      },
    }).as("createToken")

    // Fill out form
    cy.get("select").select("invoice")
    cy.get('input[placeholder*="asset name"]').type("Test Invoice Token")
    cy.get('input[type="number"]').type("1")
    cy.get("textarea").first().type("Test invoice for cypress testing")

    // Submit form
    cy.get("button").contains("Create Token").click()

    // Wait for API call
    cy.wait("@createToken")

    // Check for success message
    cy.contains("Token Created Successfully")
  })

  it("should switch to manage tokens tab", () => {
    cy.contains("Manage Tokens").click()
    cy.contains("No tokens created yet").should("be.visible")
  })
})
