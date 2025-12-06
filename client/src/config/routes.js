const routes = {
  BASE_FACULTY: "/faculty",
  BASE_STUDENT: "/student",
};

const facultyRoutes = {
  DASHBOARD: `${routes.BASE_FACULTY}/dashboard`,
  ASSIGNMENT: `${routes.BASE_FACULTY}/assignment`,
  CREATE_ASSIGNMENT: `${routes.BASE_FACULTY}/assignment/create`,
  EDIT_ASSIGNMENT: `${routes.BASE_FACULTY}/assignment/edit/:id`,
  BATCH: `${routes.BASE_FACULTY}/batch`,
  CREATE_BATCH: `${routes.BASE_FACULTY}/batch/create`,
  EDIT_BATCH: `${routes.BASE_FACULTY}/batch/edit/:id`,
};

const studentRoutes = {
  DASHBOARD: `${routes.BASE_STUDENT}/dashboard`,
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
};

export { path, routes };
