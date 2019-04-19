# yo
> yo is a optimizer of yourator.

## How To Use
1. Install Node.js
2. Clone Repo
```bash
git clone git@github.com:AllJointTW/yo.git
cd yo
```

3. Install Package
```bash
yarn # or npm install
```

4. Setup Your Jobs And Companies URL In `target.json`
**url**
![url of companies](https://user-images.githubusercontent.com/13268073/56444342-dd0e7800-632a-11e9-9eef-1c56c1b24cf2.png)
![url of jobs](https://user-images.githubusercontent.com/13268073/56444325-ca943e80-632a-11e9-8fbd-89f8bea5267b.png)

**target.json**
```
{
  "jobs": [...url],
  "companies": [...url]
}
```

5. Run Scripts
```
USERNAME=your-username PASSWORD=your-password SHOW_BROWSER=0 yarn start
```
