export class ApiEndpoints {
    static readonly Generic = {
        Actions: {
            GetAll: 'getAll',
            GetPaged: 'paged',
            Get: (id: string | number) => `get/${id}`,
            Create: 'create',
            Update: 'update',
            Delete: (id: string | number) => `delete/${id}`,
        }
    };

    static readonly COURSES = {
        Controller: 'courses',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };
}