import * as rl from "readline-sync";
import { Product,Type,Review } from "../interfaces/interfaces"

const getProduct = async (): Promise<Product[]> => {
    try {
      const response = await fetch("https://github.com/EldrupJarne/JSON-Host/raw/main/products.json");
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); // You can replace this with the actual processing of the data
  
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  

let quit: boolean = false;
while (!quit) {
    getProduct();
    quit = true;
}