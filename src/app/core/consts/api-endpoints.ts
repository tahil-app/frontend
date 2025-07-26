export class ApiEndpoints {
    static readonly Generic = {
        Actions: {
            GetAll: 'getAll',
            GetPaged: 'paged',
            Get: (id: string | number) => `/${id}`,
            Create: 'create',
            Update: 'update',
            Delete: (id: string | number) => `/${id}`,
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

    static readonly ROOMS = {
        Controller: 'rooms',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };

    static readonly TEACHERS = {
        Controller: 'teachers',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };
}