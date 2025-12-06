const routes = {
  BASE_FACULTY: "/faculty",
  BASE_STUDENT: "/student",
  BASE_ADMIN: "/admin",
};

const facultyRoutes = {
  DASHBOARD: `${routes.BASE_FACULTY}/dashboard`,
  ASSIGNMENT: `${routes.BASE_FACULTY}/assignment`,
  CREATE_ASSIGNMENT: `${routes.BASE_FACULTY}/assignment/create`,
  EDIT_ASSIGNMENT: `${routes.BASE_FACULTY}/assignment/edit/:id`,
  BATCH: `${routes.BASE_FACULTY}/batch`,
  CREATE_BATCH: `${routes.BASE_FACULTY}/batch/create`,
  EDIT_BATCH: `${routes.BASE_FACULTY}/batch/edit/:id`,
  STUDENT: `${routes.BASE_FACULTY}/student`,
  CREATE_STUDENT: `${routes.BASE_FACULTY}/student/create`,
  EDIT_STUDENT: `${routes.BASE_FACULTY}/student/edit/:id`,
};

const studentRoutes = {
  DASHBOARD: `${routes.BASE_STUDENT}/dashboard`,
};

const adminRoutes = {
  DASHBOARD: `${routes.BASE_ADMIN}/dashboard`,
  FACULTY: `${routes.BASE_ADMIN}/faculty`,
  CREATE_FACULTY: `${routes.BASE_ADMIN}/faculty/create`,
  EDIT_FACULTY: `${routes.BASE_ADMIN}/faculty/edit/:id`,
  SETTINGS: `${routes.BASE_ADMIN}/settings`,
};

const authRoutes = {
  LOGIN: "/login",
  RESET: "/reset",
  RESET_PASSWORD: "/reset-password/:token",
};

const path = {
  auth: authRoutes,
  faculty: facultyRoutes,
  student: studentRoutes,
  admin: adminRoutes,
};

export { path, routes };
