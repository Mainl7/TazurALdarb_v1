import { router } from "./init";
import { cardsRouter } from "./routers/cards";
import { occasionsRouter } from "./routers/occasions";

export const appRouter = router({
  cards: cardsRouter,
  occasions: occasionsRouter,
});

export type AppRouter = typeof appRouter;
