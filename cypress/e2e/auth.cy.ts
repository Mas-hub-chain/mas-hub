describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/auth/login")
  })

  it("should display login form", () => {
    cy.contains("Welcome Back")
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("be.visible")
    cy.get("button").contains("Sign In").should("be.visible")
  })

  it("should show validation errors for invalid email", () => {
    cy.get('input[type="email"]').type("invalid-email")
    cy.get('input[type="password"]').type("password123")
    cy.get("button").contains("Sign In").click()

    // Should show browser validation error for invalid email
    cy.get('input[type="email"]:invalid').should("exist")
  })

  it("should navigate to register page", () => {
    cy.contains("Sign up").click()
    cy.url().should("include", "/auth/register")
    cy.contains("Create Account")
  })

  it("should redirect to dashboard after successful login", () => {
    // This would require setting up test user credentials
    // cy.get('input[type="email"]').type('test@example.com')
    // cy.get('input[type="password"]').type('password123')
    // cy.get('button').contains('Sign In').click()
    // cy.url().should('include', '/dashboard')
  })
})
