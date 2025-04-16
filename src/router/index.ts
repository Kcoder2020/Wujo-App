import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";
import { Commit } from "vuex"; // Added import for Commit
import LoginPage from "../views/LoginPage.vue";
import SignupPage from "../views/SignupPage.vue";
import CollectorDashboard from "../views/CollectorDashboard.vue";
import MemberDashboard from "../views/MemberDashboard.vue";
import MyIqubsPage from "../views/MyIqubsPage.vue";
import CreateIqubPage from "../views/CreateIqubPage.vue";
import IqubDetailPage from "../views/IqubDetailPage.vue";
import JoinedIqubsPage from "../views/JoinedIqubsPage.vue";
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import OnboardingPage from "../components/OnboardingPage.vue"; // Corrected path
import { User } from "@/types"; // Assuming User type is defined here

// --- Development Mode Sample Users ---
const sampleCollectorUser: User = {
  id: "dev-collector-001",
  name: "Dev Collector",
  email: "collector@dev.local",
  role: "collector",
  phone: "000-000-0000", // Added dummy phone
  gender: "other", // Added dummy gender
  // Add other necessary user fields with dummy data
};

const sampleMemberUser: User = {
  id: "dev-member-001",
  name: "Dev Member",
  email: "member@dev.local",
  role: "member",
  phone: "000-000-0000", // Added dummy phone
  gender: "other", // Added dummy gender
  // Add other necessary user fields with dummy data
};
// --- End Development Mode Sample Users ---

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/onboarding", // Redirect root to onboarding
  },
  {
    path: "/home", // Keep /home if needed, maybe redirect based on login status later
    name: "Home",
    component: HomeView,
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: OnboardingPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupPage,
  },
  {
    path: "/collector-dashboard",
    name: "collector-dashboard",
    component: CollectorDashboard,
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/member-dashboard",
    name: "member-dashboard",
    component: MemberDashboard,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/my-iqubs",
    name: "my-iqubs",
    component: MyIqubsPage,
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/create-iqub",
    name: "create-iqub",
    component: CreateIqubPage,
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/iqub/:id",
    name: "iqub-detail",
    component: IqubDetailPage,
    meta: { requiresAuth: true, roles: ["collector", "member"] }, // Assuming both can view details
    props: true,
  },
  {
    path: "/joined-iqubs",
    name: "joined-iqubs",
    component: JoinedIqubsPage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  let user = store.getters["auth/getUser"] as User | null; // Allow null initially

  // --- Development Mode Bypass ---
  if (
    process.env.NODE_ENV === "development" && // Check for development environment
    to.meta.requiresAuth && // Check if route requires authentication
    !isLoggedIn && // Check if user is not logged in
    (to.query.role === "collector" || to.query.role === "member") // Check for role query parameter
  ) {
    const role = to.query.role;
    const sampleUser =
      role === "collector" ? sampleCollectorUser : sampleMemberUser;

    console.warn(`DEV MODE: Simulating login for role: ${role}`); // Log warning

    // Simulate login by committing to Vuex store
    store.commit("auth/SET_USER", sampleUser);
    store.commit("auth/SET_TOKEN", `dev_mock_token_${role}`); // Use a mock token
    store.commit("auth/SET_STATUS", "succeeded");

    // Re-fetch user after simulated login for role checks below if needed
    // NOTE: Since we call next() immediately, subsequent checks in *this* guard execution
    // for the simulated user aren't strictly necessary here. The *next* navigation
    // will see the user as logged in.
    user = store.getters["auth/getUser"] as User; // Update user variable

    next(); // Allow navigation
    return; // Stop further execution of this guard instance
  }
  // --- End Development Mode Bypass ---

  // --- Standard Authentication & Authorization Logic ---
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      // User not logged in, redirect to login page
      next("/login");
    } else if (user) {
      // Check if user object exists
      // User is logged in, check roles
      if (Array.isArray(to.meta.roles) && 
          to.meta.roles.includes(user.role)) {
        // User has the required role, allow navigation
        next();
      } else {
        // User doesn't have the required role, redirect to their dashboard
        console.warn(
          `Redirecting: User role "${user.role}" does not match required roles "${to.meta.roles}" for route ${to.path}`
        );
        if (user.role === "collector") {
          next("/collector-dashboard");
        } else if (user.role === "member") {
          next("/member-dashboard");
        } else {
          // Fallback if user role is unknown or no specific dashboard
          next("/about"); // Or redirect to a generic logged-in page
        }
      }
    } else {
      // Should not happen if isLoggedIn is true, but as a safeguard:
      console.error(
        "User is logged in but user object is null. Redirecting to login."
      );
      store.dispatch("auth/logout"); // Log out inconsistent state
      next("/login");
    }
  } else {
    // Route doesn't require auth, allow navigation
    next();
  }
});

export default router;
