import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import ControlLayout from "./layouts/ControlLayout";
import AuthButton from "./components/global/AuthButton";
import Widget from "./components/global/Widget";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ControlLayout className="relative">
        <AuthButton />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8c52ff] opacity-40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-[#5e17eb] opacity-40 blur-3xl rounded-full"></div>
        <Widget />
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
