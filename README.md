This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements
- Node 20
- Prisma CLI  (https://www.prisma.io/docs/getting-started)


### Prisma

```bash
npm install @prisma/client
```


## Getting Started

First, run the development server:

1. Start the database through docker compose
```
docker compose up 
```

2. Load test data into the database 
```
npx prisma migrate dev --name init 
npm run seed
```

3. Start the proyect

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## User and Password [Test]

| User |  Password  | Type |
|:-----|:--------:|------:|
| admin@asd.cl   | 123456 | Admin |
| user@asd.cl   |  123456  |  User |


