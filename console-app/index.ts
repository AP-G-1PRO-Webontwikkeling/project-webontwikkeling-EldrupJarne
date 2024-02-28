import * as rl from "readline-sync";
import { Product, Type, Review } from "../interfaces/interfaces";
import { Console } from "console";

const getProduct = async (): Promise<Product[]> => {
  try {
    let response = await fetch(
      "https://github.com/EldrupJarne/JSON-Host/raw/main/products.json"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Error fetching data: ${err}`);
  }
};

const displayProduct = (product: Product): void => {
  console.log(
    `0 Product (id: ${product.index}):\n| ${product.articleName} van ${
      product.brand
    } - €${product.price}\n|\n| ${product.infoShort}\n| Score: ${reviewScore(
      product.reviews
    )}\n|\n| Specificaties:`
  );
  for (const spec of product.specifications) {
    console.log(`| -${spec}`);
  }
  console.log(
    `|\n| Laatst verkocht (yyyy-MM-dd): ${
      product.lastSold.split("T")[0]
    }\n| Product type: ${product.type.typename}\n| ${
      product.isOnCart ? "[X]" : "[ ]"
    } - in winkelwagen\n| ${
      product.isOnWishlist ? "[X]" : "[ ]"
    } - in wenslijstje\n0`
  );
};
const reviewScore = (reviews: Review[]): string => {
  let avgrating: number = 0;
  for (const review of reviews) {
    avgrating += review.rating;
  }
  avgrating = Math.round(avgrating / reviews.length);
  let reviewStr: string = "";
  for (let i = 0; i < avgrating; i++) {
    reviewStr += "* ";
  }
  return reviewStr;
};
async function main() {
  let quit: boolean = false;

  while (!quit) {
    let products: Product[] = await getProduct();
    let mainMenuOpts: string[] = ["Bekijk alle data", "Filter op ID"];
    console.clear();
    let mainMenuChoice: number = rl.keyInSelect(mainMenuOpts, "Kies uit");
    switch (mainMenuChoice) {
      case -1:
        quit = true;
        break;
      case 0:
        console.log("case 1");

        for (const product of products) {
          console.clear();
          displayProduct(product);
          console.log("Druk op 'ENTER' om verder te gaan");
          rl.question();
        }
        break;
      case 1:
        console.clear();
        let id: number = rl.questionInt(
          "Voer de ID waarop je wil filteren in: "
        );
        let filteredProduct: Product[] = products.filter((e) => e.index == id);
        // Since index is unique, will always return just one or no item(s), so display first item in returned list if th elist is not empty
        if (filteredProduct.length != 0) {
          displayProduct(filteredProduct[0]);
        } else {
          console.log(`Geen product gevonden met id: ${id}`);
        }
        console.log("Druk op 'ENTER' om verder te gaan");
        rl.question();
        break;
      default:
        console.log("nog niet geimplementeerd!");
        break;
    }
  }
}
main();
