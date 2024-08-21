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


## Evidencia

- Confirmación compra
![Confirmación compra](/public/venti/01.png)
- Dirección entrega
![Dirección entrega](/public/venti/02.png)
- Verificación orden
![Verificación orden](/public/venti/03.png)
- Pagar orden
![Pagar orden](/public/venti/04.png)
- Pagar en Venti
![Pagar](/public/venti/05.png)
- Pago exitoso
![pago exitoso](/public/venti/06.png)
- Orden pagada y confirmada
![Orden pagada y confirmada](/public/venti/07.png)
- Orden pagada en portal de administración
![Orden pagada en portal de administración](/public/venti/08.png)