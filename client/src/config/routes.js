const routes = {
  BASE_FACULTY: "/faculty",
  BASE_sTUDENT: "/student",
};

const facultyRoutes = {
  DASHBOARD: `${routes.BASE_FACULTY}/dashboard`,
  CREATE_ASSIGNMENT: `${routes.BASE_FACULTY}/assignment`,
};

const studentRoutes = {
  DASHBOARD: `${routes.BASE_sTUDENT}/dashboard`,
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
