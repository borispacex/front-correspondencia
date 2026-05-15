import {RouterProvider} from "react-router";
import {appRouter} from "./app.route.tsx";

export default function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}
