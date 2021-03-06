const puppeteer = require('puppeteer')
const dayjs = require('dayjs')
const target = 'https://www.yourator.co/'
const { jobs, companies } = require('./target.json')
const timeout = 10 * 1000
const delay = 50
const width = 1280
const height = 800
const email = process.env.EMAIL
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
    await login(page, email, password)

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
  }
}

async function login (page, email, password) {
  process.stdout.write('login...')
  await page.click('a.login-btn', { delay })
  await page.waitForSelector(
    'input#user_email:not([disabled])',
    { visible: true, timeout }
  )
  await timer(1000) // waiting for animation
  await page.type('input#user_email', email, { delay })
  await page.type('input#user_password', password, { delay })
  await Promise.all([
    page.click('div#y-login-btn', { delay }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout })
  ])
  console.log('success')
}

async function jobOptimize (page, job) {
  await page.goto(job, { waitUntil: 'networkidle0', timeout })
  const current = dayjs()
  const dateString = current.format('YYYY/MM/DD HH:mm')
  const input = await page.$('input#job_published_on');
  await input.click({ clickCount: 3 }, { delay })
  await page.type('input#job_published_on', dateString, { delay })
  await Promise.all([
    page.click('input.button.enterprise-edit-job', { delay }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout })
  ])
}

async function companyOptimize (page, company) {
  await page.goto(company, { waitUntil: 'networkidle0', timeout })
  const current = dayjs().hour() > 8 ? dayjs() : dayjs().add(-1, 'day')
  const dateString = current.format('YYYY/MM/DD')
  const input = await page.$('input#company_published_on');
  await input.click({ clickCount: 3 }, { delay })
  await page.type('input#company_published_on', dateString, { delay })
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

function randomNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

async function main () {
  while (true) {
    const mins = randomNumber(60, 120)
    await bootstrap()
    logger(`Waiting ${mins} Mins...\n`)
    await timer(mins * 60 * 1000)
  }
}

main()
