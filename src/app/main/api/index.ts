import "../config/module-alias"; //aqui não pode importar usando o @

import { PersonController } from "@/app/controllers/person";
const p = new PersonController();

p.speak("Rudhy");
p.speak();
