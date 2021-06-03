type Constructor<T = any> = { new (...args: any[]): T };

export function ServiceScanner(services: Constructor[]) {
  Scanner.services = services;
  return Scanner;
}

class Scanner {
  static services: any[];

  static scanApiMetadata() {
    const apiMetadata: any[] = [];

    this.services.forEach((service) => {
      const propertyNames = Object.getOwnPropertyNames(service.prototype).filter((property) => !["constructor"].includes(property));

      propertyNames.forEach((propertyName) => {
        const httpMetadataKey = `http:${service.prototype.constructor.name}:${propertyName}`;
        const metadata = Reflect.getMetadata(httpMetadataKey, service.prototype);
        if (metadata) apiMetadata.push(metadata);
      });
    });

    return apiMetadata;
  }
}
