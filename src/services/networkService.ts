import { Network } from "@capacitor/network";
import { ref } from "vue";

const isOnline = ref(true);

Network.addListener("networkStatusChange", (status) => {
  console.log("Network status changed", status);
  isOnline.value = status.connected;
});

const checkNetworkStatus = async () => {
  const status = await Network.getStatus();
  console.log("Network status:", status);
  isOnline.value = status.connected;
};

checkNetworkStatus();

export { isOnline, checkNetworkStatus };
