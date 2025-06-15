const { MasHubSDK } = require("@mashub/sdk")

// Initialize SDK
const masHub = new MasHubSDK({
  apiKey: process.env.MASHUB_API_KEY,
  environment: "development",
})

async function main() {
  try {
    // Test connection
    console.log("Testing connection...")
    const connected = await masHub.ping()
    console.log("Connected:", connected)

    // Create a smart contract project
    console.log("Creating smart contract project...")
    const project = await masHub.contracts.createProject({
      project_name: "Demo Project",
      description: "A demo project created with the SDK",
    })
    console.log("Project created:", project)

    // Create a token
    console.log("Creating token...")
    const token = await masHub.tokens.create({
      asset_type: "DIGITAL",
      metadata: {
        name: "Demo Token",
        description: "A demo token created with the SDK",
        quantity: 1000,
      },
    })
    console.log("Token created:", token)

    // Get analytics overview
    console.log("Getting analytics...")
    const analytics = await masHub.analytics.getOverview("24h")
    console.log("Analytics:", analytics)
  } catch (error) {
    console.error("Error:", error.message)
  }
}

main()
