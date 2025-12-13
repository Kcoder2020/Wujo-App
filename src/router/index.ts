// src/router/index.ts
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";

// Import necessary page components
import LoginPage from "../views/LoginPage.vue";
import SignupPage from "../views/SignupPage.vue";

// Import the components that will be rendered by the root router outlet
import CollectorDashboard from "../views/CollectorDashboard.vue"; // Now a full page
import MemberDashboard from "../views/MemberDashboard.vue"; // Now a full page
import MyIqubsPage from "../views/MyIqubsPage.vue"; // Now a full page
import CreateIqubPage from "../views/CreateIqubPage.vue"; // Now a full page
import ProfilePage from "../views/CollectorProfile.vue"; // Assuming this is a full page
import IqubBookPage from "../views/IqubBookPage.vue"; // Assuming this is a full page
import PaymentVerificationPage from "../views/PaymentVerificationPage.vue";
import NotificationsPage from "../views/NotificationsPage.vue"; // Import the new page

// Import standalone pages
import IqubDetailPage from "../views/IqubDetailPage.vue";
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import OnboardingPage from "../components/OnboardingPage.vue";
import JoinedIqubsPage from "../views/JoinedIqubsPage.vue";
// Import Member pages
import MemberMyIqubsPage from "../views/MemberMyIqubsPage.vue";
import MemberDiscoverPage from "../views/MemberDiscoverPage.vue";
import JoinIqubPage from "../views/JoinIqubPage.vue";
import MemberProfilePage from "../views/MemberProfilePage.vue";

import { User } from "@/types"; // Assuming User type is defined here

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/onboarding", // Redirect root to onboarding
  },
  {
    path: "/home",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: false }, // Assuming home doesn't require auth
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: OnboardingPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupPage,
    meta: { requiresAuth: false },
  },
  // --- Collector Pages (rendered by root router outlet) ---
  // These routes match the paths pushed by your CollectorTabBar buttons
  {
    path: "/collector/dashboard", // <--- Matches goTo('/collector/dashboard')
    name: "collector-dashboard", // Use a unique name
    component: CollectorDashboard, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/collector/my-iqubs", // <--- Matches goTo('/collector/my-iqubs')
    name: "my-iqubs", // Use a unique name
    component: MyIqubsPage, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/collector/create-iqub", // <--- Matches goTo('/collector/create-iqub')
    name: "create-iqub", // Use a unique name
    component: CreateIqubPage, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/collector/profile", // <--- Matches goTo('/collector/profile')
    name: "collector-profile", // Use a unique name
    component: ProfilePage, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/collector/iqub/:iqubId/member/:memberId", // <--- New route with parameters
    name: "collector-iqub-book", // Use a unique name
    component: IqubBookPage, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/collector/payment-verify/:id", // <--- Matches goTo('/collector/iqub-book')
    name: "collector-payment-verify", // Use a unique name
    component: PaymentVerificationPage, // This component is rendered fully
    meta: { requiresAuth: true, roles: ["collector"] },
  },
  {
    path: "/notifications",
    name: "notifications",
    component: NotificationsPage,
    meta: { requiresAuth: true, roles: ["collector", "member"] }, // Accessible by both roles
  },
  // --- Member Pages (rendered by root router outlet) ---
  {
    path: "/member/dashboard",
    name: "member-dashboard",
    component: MemberDashboard,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/member/my-iqubs",
    name: "member-my-iqubs",
    component: MemberMyIqubsPage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/member/discover",
    name: "member-discover",
    component: MemberDiscoverPage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/member/profile",
    name: "member-profile",
    component: MemberProfilePage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/member/join-iqub",
    name: "join-iqub",
    component: JoinIqubPage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  {
    path: "/member/joined-iqubs",
    name: "joined-iqubs", // Legacy route, can be kept for backward compatibility
    component: JoinedIqubsPage,
    meta: { requiresAuth: true, roles: ["member"] },
  },
  // --- Standalone Routes (rendered by the root <ion-router-outlet>) ---
  {
    path: "/iqub/:id",
    name: "iqub-detail",
    component: IqubDetailPage,
    meta: { requiresAuth: true, roles: ["collector", "member"] },
    props: true,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { requiresAuth: false }, // Assuming about doesn't require auth
  },
  // Catch-all for any other unmatched routes
  {
    path: "/:pathMatch(.*)*",
    redirect: "/", // Redirects unknown paths to the root
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Authentication and Authorization Guard
router.beforeEach((to, from, next) => {
  const store = useStore();
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const user = store.getters["auth/getUser"] as User | null;

  // console.log(`Navigating FROM: ${from.fullPath} TO: ${to.fullPath}`);
  // console.log(`Guard Check: isLoggedIn = ${isLoggedIn}`);
  // console.log(`Guard Check: user = ${JSON.stringify(user)}`);
  // console.log(`Guard Check: Target meta = ${JSON.stringify(to.meta)}`);

  const requiresAuth = to.meta.requiresAuth;
  const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : null;

  if (requiresAuth) {
    if (!isLoggedIn) {
      // console.log("Requires auth, but not logged in. Redirecting to login.");
      next("/login");
    } else if (user) {
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        // console.warn(
        //   `Redirecting: User role "${user.role}" does not match required roles "${requiredRoles}" for route ${to.fullPath}`
        // );
        // Redirect to the appropriate dashboard based on role
        if (user.role === "collector") {
          next("/collector/dashboard"); // Redirect to collector dashboard page
        } else if (user.role === "member") {
          next("/member/dashboard"); // Redirect to member dashboard page
        } else {
          // Fallback for unknown roles
          next("/home");
        }
      } else {
        // User is logged in and has the required role (or no specific roles required)
        // console.log(
        //   "Authentication and authorization successful. Allowing navigation."
        // );
        next();
      }
    } else {
      console.error(
        "Inconsistent state: Logged in but user object is null. Logging out."
      );
      store.dispatch("auth/logout");
      next("/login");
    }
  } else {
    // Route does not require auth
    // console.log("Route does not require auth. Allowing navigation.");
    // Optional: Prevent logged-in users from accessing auth/onboarding pages directly
    if (
      isLoggedIn &&
      (to.path === "/login" ||
        to.path === "/signup" ||
        to.path === "/onboarding")
    ) {
      // console.log(
      //   "Logged in user attempting to access auth/onboarding page. Redirecting to dashboard."
      // );
      if (user?.role === "collector") {
        next("/collector/dashboard");
      } else if (user?.role === "member") {
        next("/member/dashboard");
      } else {
        next("/home"); // Fallback
      }
    } else {
      next(); // Allow navigation
    }
  }
});

export default router;
