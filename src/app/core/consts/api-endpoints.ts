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

    static readonly GROUPS = {
        Controller: 'groups',
        Actions: {
            Paged: `paged`
        }
    };

    static readonly ATTACHMENTS = {
        Controller: 'attachment',
        Actions: {
            View: (fileName: string) => `view/${encodeURIComponent(fileName)}`,
            Download: (fileName: string) => `download/${encodeURIComponent(fileName)}`,
        }
    };

    static readonly TEACHERS = {
        Controller: 'teachers',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
            UploadAttachment: `upload-attachment`,
            DownloadAttachment: (id: string | number) => `download-attachment/${id}`,
            DeleteAttachment: (id: string | number) => `delete-attachment/${id}`,
            UploadImage: `upload-image`,
        }
    };

    static readonly STUDENTS = {
        Controller: 'students',
        Actions: {
            Paged: `paged`,
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
            UploadAttachment: `upload-attachment`,
            DownloadAttachment: (id: string | number) => `download-attachment/${id}`,
            DeleteAttachment: (id: string | number) => `delete-attachment/${id}`,
            UploadImage: `upload-image`,
        }
    };
}