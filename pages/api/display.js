const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return await readComparisons(req, res)
  } else {
    return res
      .status(405)
      .json({ message: 'Method not allowed', success: false })
  }
}

async function readComparisons(req, res) {
  const body = req.body
  try {
    const comparisons = await prisma.comparison.findMany()
    return res.status(200).json(comparisons, { success: true })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'Error reading from database', success: false })
  }
}
