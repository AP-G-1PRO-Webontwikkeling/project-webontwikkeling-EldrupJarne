import * as rl from "readline-sync";
import { Product, Type, Review } from "../interfaces/interfaces";

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
  console.clear();
  console.log(
    `0----------------------------------------------------------------\n| Product Details - ${
      product.articleName
    } (ID: ${product.index})\n| Merk: ${product.brand}\n| Type: ${
      product.type.typeName
    } (type ID: ${product.type.id})\n| - Beschrijving: ${
      product.type.description
    }\n| - Tags: ${product.type.tags.join(", ")}\n| - Status Actief: ${
      product.type.statusActive ? "JA" : "NEE"
    }\n| Prijs: $${product.price.toFixed(2)}\n| Laatst verkocht: ${
      product.lastSold
    }\n| Beschrijving: ${product.infoShort}\n| Informatie: ${
      product.info
    }\n| Aantal: ${product.count}\n| Staat in winkelwagen: ${
      product.isOnCart ? "JA" : "NEE"
    }\n| Staat in wenslijstje: ${
      product.isOnWishlist ? "JA" : "NEE"
    }\n| Afbeelding: ${
      product.imageSrc
    }\n|\n| Specificaties:\n${product.specifications
      .map((spec) => `|   - ${spec}`)
      .join("\n")}\n| \n| Klanten recensies:\n${product.reviews
      .map(
        (review, index) =>
          `| - Recensie ${index + 1}:\n|   - Gebruikersnaam: ${
            review.username
          }\n|   - Score: ${review.rating}/5\n|   - Opmerking: ${
            review.comment
          }`
      )
      .join(
        "\n|\n"
      )}\n0----------------------------------------------------------------`
  );
  console.log("Druk op 'ENTER' om verder te gaan");
  rl.question();
};

async function main() {
  let quit: boolean = false;

  let products: Product[] = await getProduct();
  while (!quit) {
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
          displayProduct(product);
        }
        break;
      case 1:
        console.clear();
        let id: number = rl.questionInt(
          "Voer de ID waarop je wil filteren in: "
        );
        let filteredProduct: Product[] = products.filter((e) => e.index == id);
        // Since index is unique, will always return just 1 or 0 item(s), display first item in returned list if the list is not empty
        if (filteredProduct.length != 0) {
          displayProduct(filteredProduct[0]);
        } else {
          console.clear();
          console.log(`Geen product gevonden met id: ${id}`);
          console.log("Druk op 'ENTER' om verder te gaan");
          rl.question();
        }
        break;
      default:
        console.log("nog niet geimplementeerd!");
        break;
    }
  }
}
main();
