const puppeteer = require('puppeteer')
const dayjs = require('dayjs')
const target = 'https://www.yourator.co/'
const { jobs, companies } = require('./target.json')
const timeout = 10 * 1000
const delay = 50
const width = 1280
const height = 800
const username = process.env.USERNAME
const password = process.env.PASSWORD
const headless = !(process.env.SHOW_BROWSER === '1')

async function bootstrap () {
  try {
    logger(`[${dayjs().format('YYYY/MM/DD HH:mm:ss')}] yourator optimization starting\n`)
    const browser = await puppeteer.launch({
      headless,
      args: ['--start-fullscreen', '--disable-setuid-sandbox', '--no-sandbox']
    })
    const page = await browser.newPage()

    await page.setViewport({ width, height })
    await page.goto(target, { waitUntil: 'networkidle0', timeout })
    await login(page, username, password)

    for (const index in jobs) {
      logger(`jobs(${Number(index) + 1}/${jobs.length})...`)
      const job = jobs[index]
      await jobOptimize(page, job)
      logger('success\n')
    }

    for (const index in companies) {
      logger(`companies(${Number(index) + 1}/${companies.length})...`)
      const company = companies[index]
      await companyOptimize(page, company)
      logger('success\n')
    }

    await browser.close()
    logger(`[${dayjs().format('YYYY/MM/DD HH:mm:ss')}] finished\n`)
  } catch (err) {
    logger('Error:', err.message)
    process.exit(1)
  }
}

async function login (page, username, password) {
  process.stdout.write('login...')
  await page.click('a.login-btn', { delay })
  await page.waitForSelector(
    'input#user_email:not([disabled])',
    { visible: true, timeout }
  )
  await timer(1000) // waiting for animation
  await page.type('input#user_email', username, { delay })
  await page.type('input#user_password', password, { delay })
  await Promise.all([
    page.click('div#y-login-btn', { delay }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout })
  ])
  console.log('success')
}

async function jobOptimize (page, job) {
  await page.goto(job, { waitUntil: 'networkidle0', timeout })
  const current = dayjs().format('YYYY/MM/DD HH:mm')
  await page.type('input#job_published_on', current, { delay })
  await Promise.all([
    page.click('input.button.enterprise-edit-job', { delay }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout })
  ])
}

async function companyOptimize (page, company) {
  await page.goto(company, { waitUntil: 'networkidle0', timeout })
  const current = dayjs().format('YYYY/MM/DD')
  await page.type('input#company_published_on', current, { delay })
  await Promise.all([
    page.click('input.button[name="commit"]', { delay }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout })
  ])
}

function timer (ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

function logger (...params) {
  for (const param of params) {
    if (params.length > 1) {
      process.stdout.write(`${param} `)
    } else {
      process.stdout.write(param)
    }
  }
}

bootstrap()
