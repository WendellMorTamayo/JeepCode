import { useEffect, useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import { validateJeepCodes } from "./utils";
import jeepcodes from "./utils/jeepcodes.json";

function App() {
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [codes, setCodes] = useState([]);
  const [foundRoutes, setFoundRoutes] = useState([]);

  const colorCodes = ["black", "red", "blue", "green"];

  const handleChange = (event) => {
    setInput(event.target.value);
    setIsValid(validateJeepCodes(event.target.value));
    setCodes([]);
    setFoundRoutes([]);
  };

  const handleButtonClick = async () => {
    if (!isValid) {
      alert("Invalid input");
      return;
    }
    setIsLoading(true);
    let seenRoutes = {};
    let count = 0;
    const inputCodes = input.split(",");
    inputCodes.map((code) => {
      const trimmedCode = code.trim();
      const route = jeepcodes.routes[trimmedCode] || [];
      console.log("Route", route);
      setFoundRoutes((prev) => [...prev, route]);
      route.forEach((place) => {
        console.log("Seen route:", place);
        if (!seenRoutes[place]) {
          seenRoutes[place] = {
            code: place,
            data: {
              color: "black",
              seenAt: 0,
            },
          };
        } else {
          seenRoutes[place].data.seenAt = count;
          seenRoutes[place].data.color =
            colorCodes[seenRoutes[place].data.seenAt];
        }
      });
      count++;
    });

    console.log("New", seenRoutes);

    setCodes(seenRoutes);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("Found codes: ", foundRoutes);
  }, [foundRoutes]);

  const DisplayCodes = () => {
    return foundRoutes.map((route, index) => (
      <div key={index}>
        {route.code} {"=>"}{" "}
        {route.map((place, placeIndex) => (
          <span
            className="text-xs"
            key={placeIndex}
            style={{ color: codes[place].data.color }}>
            {place}
            {placeIndex !== route.length - 1 && " <-> "}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-white w-screen h-screen flex justify-center items-center">
      <div className="bg-gray-200 w-96 p-6 rounded-lg">
        <h1 className="text-2xl text-center font-bold mb-2">Jeep Codes</h1>
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            label="Enter codes (comma-separated)"
            value={input}
            onChange={handleChange}
            className="border border-gray-400 p-2 mb-2"
          />
          {!isValid && <p className="text-red-600">Invalid input</p>}
          <Button
            loading={isLoading}
            onClick={handleButtonClick}
            className="justify-center"
            color="blue"
            ripple="light"
            buttonType="filled">
            {isLoading ? "Checking routes..." : "Check Routes"}
          </Button>
          {/* display the route here */}
          {<DisplayCodes />}
        </div>
      </div>
    </div>
  );
}

export default App;
