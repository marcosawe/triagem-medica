// Arquivo: src/App.tsx
import { useState, useEffect } from "react";
import { MantineProvider, Loader, Center } from "@mantine/core";
import { TriageNavbar } from "./components/menu/NavegationBar";
import "@mantine/core/styles.css";
import { Home } from "./components/home/Home";

export default function App() {
  const [userData, setUserData] = useState({
    name: "Mimico",
    role: "Piroca",
    initials: "Buceta",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Construir API de Conexão com base de usuários
      try {
        fetch("localhost:3000/user", {
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify(
            {

            }
          ),
        });
      } catch (error) {
        
      }
    };

    fetchUser();
  }, []);

  return (
    <MantineProvider>
      {isLoading ? (
        <Center style={{ height: "100vh" }}>
          <Loader color="blue" type="dots" />
        </Center>
      ) : (
        <div>
          <TriageNavbar userName={userData.name} userRole={userData.role} />
          <Home/>
        </div>
      )}
    </MantineProvider>
  );
}
