export class PersonController {
  speak(name?: string): string {
    return `Ola ${name?.toUpperCase ?? "Fulano"}!!!`;
  }
}

