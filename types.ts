
export interface ServiceNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'external' | 'gateway';
  description: string;
  technologies?: string[];
}

export interface Connection {
  from: string;
  to: string;
  label: string;
}

export interface SchemaTable {
  name: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
