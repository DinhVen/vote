let contract;
let signer;

async function init() {
  if (typeof window.ethereum === 'undefined') {
    alert("⚠️ Bạn cần cài đặt MetaMask để sử dụng ứng dụng này!");
    return;
  }

  try {
    console.log("⏳ Đang yêu cầu MetaMask kết nối...");
    // Bật MetaMask popup
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const address = await signer.getAddress();
    console.log("✅ MetaMask đã kết nối:", address);
    alert("✅ MetaMask đã kết nối: " + address);
  } catch (err) {
    console.error("❌ Lỗi khi kết nối MetaMask:", err);
    alert("❌ Không thể kết nối MetaMask. Hãy thử reload lại trang.");
  }
}

async function vote(person) {
  try {
    if (!contract) {
      alert("❌ Chưa kết nối hợp đồng!");
      return;
    }

    if (person === "van") await contract.voteVan();
    else if (person === "nam") await contract.voteNam();
    else if (person === "lap") await contract.voteLap();

    alert("✅ Bỏ phiếu thành công!");
  } catch (err) {
    console.error("❌ Lỗi chi tiết:", err);
    alert("❌ Lỗi khi bỏ phiếu!");
  }
}

async function getResult() {
  if (!contract) return alert("❌ Chưa kết nối hợp đồng!");
  const res = await contract.getResult();
  document.getElementById("result").innerText =
    `${res[0]}: ${res[1]} phiếu\n${res[2]}: ${res[3]} phiếu\n${res[4]}: ${res[5]} phiếu`;
}

async function getWinner() {
  if (!contract) return alert("❌ Chưa kết nối hợp đồng!");
  const w = await contract.getWinner();
  document.getElementById("winner").innerText = `🏆 Người thắng: ${w[0]} (${w[1]} phiếu)`;
}

// Kích hoạt tự động khi load web
window.addEventListener("load", init);
