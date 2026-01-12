/* ================================
   PASSWORD TOGGLE
================================ */
function togglePasswordLogin() {
  const pwdInput = document.getElementById("loginPassword");
  const pwdToggle = document.getElementById("passwordToggle");

  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    pwdToggle.textContent = "🙈";
  } else {
    pwdInput.type = "password";
    pwdToggle.textContent = "👁️";
  }
}

/* ================================
   CARD FLIP
================================ */
function flipCard() {
  document.getElementById("auth-card").classList.toggle("flipped");
  document.getElementById("arrow-btn").classList.toggle("rotated");
}

/* ================================
   STUDENT DATA
   value = FOLDER NAME (SAFE)
   label = DISPLAY NAME
================================ */
const students = [
  { value: "ASUNCION_BJORN_SIGFRID_U", label: "ASUNCION, BJORN SIGFRID U.", password: "UY" },
  { value: "AVILA_ANTONIO_IV_C", label: "AVILA, ANTONIO IV C.", password: "CRUZ" },
  { value: "BICOS_MARK_ETHAN_R", label: "BICOS, MARK ETHAN R.", password: "RIVERA" },
  { value: "DESQUITADO_KARL_LOUIS_B", label: "DESQUITADO, KARL LOUIS B.", password: "BRISTOL" },
  { value: "ENCARNACION_RALPH_JONATHAN_S", label: "ENCARNACION, RALPH JONATHAN S.", password: "SEVILLE" },
  { value: "GACIAS_ANGELO_R", label: "GACIAS, ANGELO R.", password: "RODRIGUEZ" },
  { value: "GALOSMO_GIOVANNI_MARCO_F", label: "GALOSMO, GIOVANNI MARCO F.", password: "FRIAS" },
  { value: "GUERRA_GABRIEL_XIAN_D", label: "GUERRA, GABRIEL XIAN D.", password: "DE LEON" },
  { value: "MOLINA_JOHNDEL_CHRISTIAN_B", label: "MOLINA, JOHNDEL CHRISTIAN B.", password: "BALUNCIO" },
  { value: "PARAGAS_GUILBERT_ANDREI_B", label: "PARAGAS, GUILBERT ANDREI B.", password: "BAETIONG" },
  { value: "RAMOS_SEAN_LENNARD_O", label: "RAMOS, SEAN LENNARD O.", password: "ORLANDA" },
  { value: "STA_MARIA_KARL_ANTONIO_C", label: "STA. MARIA, KARL ANTONIO C.", password: "CRISTOBAL" },
  { value: "TANALLON_JOHAN_ANDREI_T", label: "TANALLON, JOHAN ANDREI T.", password: "TADINA" },
  { value: "VILLANUEVA_CARL_CORBIN_B", label: "VILLANUEVA, CARL CORBIN B.", password: "BELEN" },
  { value: "CAMBE_ALDEA_VENICE_HARRIEL_B", label: "CAMBE, ALDEA VENICE HARRIEL B.", password: "BARRERA" },
  { value: "CONCEPCION_ANNE_CLAIRE_T", label: "CONCEPCION, ANNE CLAIRE T.", password: "TRAJANO" },
  { value: "DELA_CRUZ_ABBIE_JOY_P", label: "DELA CRUZ, ABBIE JOY P.", password: "PASCUA" },
  { value: "DELA_CRUZ_PRINCESS_AMIEL_R", label: "DELA CRUZ, PRINCESS AMIEL R.", password: "RAPINAN" },
  { value: "GUARDIAN_CALLIOPE_SHIMMER_C", label: "GUARDIAN, CALLIOPE SHIMMER C.", password: "CAPONES" },
  { value: "LEONOR_EMPRESS_HAMAIAH_B", label: "LEONOR, EMPRESS HAMAIAH B.", password: "BERNARDO" },
  { value: "LINA_FIDELITY_R", label: "LINA, FIDELITY R.", password: "RAMOS" },
  { value: "MENDOZA_ANIKA_SEJU_D", label: "MENDOZA, ANIKA SEJU D.", password: "DANTES" },
  { value: "MIRANDA_SHANELLE_A", label: "MIRANDA, SHANELLE A.", password: "ALFONSO" },
  { value: "NASAYAO_FREYA_MONICA_N", label: "NASAYAO, FREYA MONICA N.", password: "NAMIA" },
  { value: "PASCUAL_PRINCESS_DIANA_N", label: "PASCUAL, PRINCESS DIANA N.", password: "NASAYAO" },
  { value: "PEPANIA_XYLENE_LLOISE_S", label: "PEPANIA, XYLENE LLOISE S.", password: "SAN DIEGO" },
  { value: "REYES_REESE_SAMANTHA_G", label: "REYES, REESE SAMANTHA G.", password: "GUIA" },
  { value: "SEDAVIA_SABRINA_ANNIKA_P", label: "SEDAVIA, SABRINA ANNIKA P.", password: "PANGILINAN" },
  { value: "TUGADE_HANNAH_SOPHIA_B", label: "TUGADE, HANNAH SOPHIA B.", password: "BARCEL" },
  { value: "UMARAN_MARY_SIOUXSIEROSE_P", label: "UMARAN, MARY SIOUXSIEROSE P.", password: "PEREZ" },
  { value: "VILLANUEVA_RINA_CHERICA_M", label: "VILLANUEVA, RINA CHERICA M.", password: "MENDIOLA" }
];

/* ================================
   POPULATE DROPDOWN
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("studentSelect");
  const bubble = document.getElementById("login-bubble");

  bubble.textContent = "Please fill all fields";

  students.forEach(s => {
    const option = document.createElement("option");
    option.value = s.value;        // SAFE folder
    option.textContent = s.label;  // Pretty name
    select.appendChild(option);
  });
});

/* ================================
   LOGIN HANDLER
================================ */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const select = document.getElementById("studentSelect");
  const passwordInput = document.getElementById("loginPassword");
  const bubble = document.getElementById("login-bubble");

  bubble.style.display = "none";

  if (!select.value || !passwordInput.value) {
    bubble.style.display = "block";
    return;
  }

  const student = students.find(s => s.value === select.value);
  const enteredPassword = passwordInput.value.trim().toUpperCase();

  if (!student || enteredPassword !== student.password) {
    bubble.style.display = "block";
    return;
  }

  // ✅ FINAL WORKING PATH
// Navigate relative path for local files
window.location.href = `student/${student.value}/studentHome.html`;

});
