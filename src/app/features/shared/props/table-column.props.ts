export class TableColumn {
    title!: string;
    field!: string;
    show?: boolean;
    type?: 'time' | 'text' | 'date' | 'number';
    onClick?: (row: any) => void;
}