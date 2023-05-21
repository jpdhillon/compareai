const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await addComparison(req, res)
  } else {
    return res
      .status(405)
      .json({ message: 'Method not allowed', success: false })
  }
}

async function addComparison(req, res) {
  const body = req.body
  try {
    const newEntry = await prisma.comparison.create({
      data: {
        result: body.result,
        prompt: body.prompt,
        saverName: body.saverName,
      },
    })
    return res.status(200).json(newEntry, { success: true })
  } catch (error) {
    console.error('Request error', error)
    res.status(500).json({ error: 'Error adding comparison', success: false })
  }
}
