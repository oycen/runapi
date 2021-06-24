type Constructor<T = any> = { new (...args: any[]): T };

export function ServiceScanner(services: Constructor[]) {
  return new Scanner(services);
}

class Scanner {
  services: Constructor[];

  constructor(services: Scanner["services"]) {
    this.services = services;
  }

  scan() {
    const apiMetadata: any[] = [];

    this.services.forEach(service => {
      const propertyNames = Object.getOwnPropertyNames(service.prototype).filter(property => !["constructor"].includes(property));

      propertyNames.forEach(propertyName => {
        const httpMetadataKey = `http:${service.prototype.constructor.name}:${propertyName}`;
        const metadata = Reflect.getMetadata(httpMetadataKey, service.prototype);
        if (metadata) apiMetadata.push(metadata);
      });
    });

    return apiMetadata;
  }
}
