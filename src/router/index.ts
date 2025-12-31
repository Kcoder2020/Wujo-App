// src/router/index.ts
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";

// ===== Auth Views =====
import LoginPage from "../views/authViews/LoginPage.vue";
import SignupPage from "../views/authViews/SignupPage.vue";

// ===== Collector Views =====
import CollectorDashboard from "../views/collectorViews/CollectorDashboard.vue";
import ProfilePage from "../views/collectorViews/CollectorProfile.vue";
import CreateIqubPage from "../views/collectorViews/CreateIqubPage.vue";
import MyIqubsPage from "../views/collectorViews/MyIqubsPage.vue";
import IqubBookPage from "../views/collectorViews/IqubBookPage.vue";
import IqubDetailPage from "../views/collectorViews/IqubDetailPage.vue";

// ===== Member Views =====
import MemberDashboard from "../views/memberViews/MemberDashboard.vue";
import JoinedIqubsPage from "../views/memberViews/JoinedIqubsPage.vue";
import MemberMyIqubsPage from "../views/memberViews/MemberMyIqubsPage.vue";
import MemberDiscoverPage from "../views/memberViews/MemberDiscoverPage.vue";
import JoinIqubPage from "../views/memberViews/JoinIqubPage.vue";
import MemberProfilePage from "../views/memberViews/MemberProfilePage.vue";
import LotteryNotificationsPage from "../views/memberViews/LotteryNotificationsPage.vue";

// ===== Shared Views =====
import PaymentVerificationPage from "../views/PaymentVerificationPage.vue";
import NotificationsPage from "../views/NotificationsPage.vue";

// ===== Components =====
// Old onboarding (preserved for rollback): "../components/OnboardingPage.vue"
import OnboardingPageV2 from "../views/onboarding/OnboardingPageV2.vue";

import { User } from "@/types"; // Assuming User type is defined here

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/onboarding", // Redirect root to onboarding
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: OnboardingPageV2,
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
    path: "/member/lottery-notifications",
    name: "member-lottery-notifications",
    component: LotteryNotificationsPage,
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
  {
    path: "/member/iqub/:iqubId",
    name: "member-iqub-detail",
    component: () => import("../views/memberViews/MemberIqubDetailPage.vue"),
    meta: { requiresAuth: true, roles: ["member"] },
    props: true,
  },
  // --- Standalone Routes (rendered by the root <ion-router-outlet>) ---
  {
    path: "/iqub/:id",
    name: "iqub-detail",
    component: IqubDetailPage,
    meta: { requiresAuth: true, roles: ["collector", "member"] },
    props: true,
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
          next("/onboarding");
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
        next("/onboarding"); // Fallback
      }
    } else {
      next(); // Allow navigation
    }
  }
});

export default router;
