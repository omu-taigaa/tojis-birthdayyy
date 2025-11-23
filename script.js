/* ---------- Configurable accepted answers ---------- */
const ACCEPTED = {
  names: ["arsen", "toji"],
  birthdayAnswer: "yes",
  age: "18",
  senders: ["chloe", "taiga"],
  fossilAnswer: "yes",
  dateTarget: { day: 26, month: 11, year: 2025 },
};

function showMsg(id, txt, ok) {
  const el = document.getElementById(id);
  el.textContent = txt;
  el.style.color = ok ? "#bff7ff" : "#ffadb0";
}
function clearField(id) {
  document.getElementById(id).value = "";
}

let progress = [false, false, false, false, false, false];
function revealLetter(index) {
  if (progress[index]) return;
  progress[index] = true;
  const el = document.getElementById("l" + (index + 1));
  el.classList.add("revealed");
  const count = progress.filter(Boolean).length;
  document.getElementById("progressCount").textContent = count;
  el.animate(
    [
      { transform: "translateY(6px) scale(.98)" },
      { transform: "translateY(-6px) scale(1.06)" },
    ],
    { duration: 320, easing: "cubic-bezier(.2,.9,.3,1)" }
  );
  if (count === 6) {
    document.getElementById("finalMessage").style.display = "block";
    typeWriter(document.getElementById("typewriter"), 20);
    launchConfetti();
  }
}

function checkQ1() {
  const val = (document.getElementById("nameInput").value || "")
    .trim()
    .toLowerCase();
  if (!val) {
    showMsg("q1-msg", "WHAT IS YOUR NAME");
    return;
  }
  if (ACCEPTED.names.includes(val)) {
    showMsg("q1-msg", "correct now move on", true);
    revealLetter(0);
  } else {
    showMsg("q1-msg", "nuh uh", false);
  }
}

function checkQ2(answer) {
  const a = String(answer || "")
    .trim()
    .toLowerCase();
  if (a === ACCEPTED.birthdayAnswer) {
    showMsg("q2-msg", "good boy", true);
    revealLetter(1);
  } else {
    showMsg("q2-msg", "bruh no loser", false);
  }
}

function checkQ3() {
  const val = parseInt(document.getElementById("ageInput").value, 10);
  if (isNaN(val)) {
    showMsg("q3-msg", "how old is u turning");
    return;
  }
  if (val === parseInt(ACCEPTED.age, 10)) {
    showMsg(
      "q3-msg",
      "i mean the answer should be 7.9 trillion but okay ig..",
      true
    );
    revealLetter(2);
    document.getElementById("ageInput").disabled = true;
  } else {
    showMsg("q3-msg", "are you okay.. answer again", false);
  }
}

function checkQ4() {
  const val = (document.getElementById("senderInput").value || "")
    .trim()
    .toLowerCase();
  if (!val) {
    showMsg(
      "q4-msg",
      "who send u this (hint: amazingly amazing person who is amazing heheh)"
    );
    return;
  }
  if (ACCEPTED.senders.includes(val)) {
    showMsg("q4-msg", "correct correct i am amazing yes", true);
    revealLetter(3);
  } else {
    showMsg("q4-msg", "you stupid no im not whats 9+10 21 you stupid", false);
  }
}

function checkQ5(answer) {
  const a = String(answer || "")
    .trim()
    .toLowerCase();
  if (a === ACCEPTED.fossilAnswer) {
    showMsg("q5-msg", "so you know just how ancient you are hahaha", true);
    revealLetter(4);
  } else {
    showMsg("q5-msg", "do u have dementia or smth..", false);
  }
}

function checkQ6() {
  const text = (document.getElementById("dateText").value || "").trim();
  const daySel = document.getElementById("daySel").value;
  const monthSel = document.getElementById("monthSel").value;
  const yearSel = document.getElementById("yearSel").value;
  let parsed = null;
  if (text) {
    parsed = tryParseDate(text);
  } else if (daySel && monthSel && yearSel) {
    parsed = {
      day: parseInt(daySel, 10),
      month: parseInt(monthSel, 10),
      year: parseInt(yearSel, 10),
    };
  }
  if (!parsed) {
    showMsg("q6-msg", "try another format bruh its not working", false);
    return;
  }
  const t = ACCEPTED.dateTarget;
  if (
    parsed.day === t.day &&
    parsed.month === t.month &&
    (parsed.year === t.year || parsed.year === t.year % 100)
  ) {
    showMsg(
      "q6-msg",
      "right right so basically like this is like when you like okay so idk how to explain it like its when you kinda like sigh okay so basically",
      true
    );
    revealLetter(5);
  } else {
    showMsg("q6-msg", "how can u not know your own birthday..", false);
  }
}

function tryParseDate(text) {
  text = text.trim();
  const sepText = text.replace(/\s+/g, " ").replace(/[,]/g, "").trim();
  const partsSlash = sepText.split(/[\/\-\.\s]+/);
  if (partsSlash.length === 3) {
    const a = parseInt(partsSlash[0], 10);
    const b = parseInt(partsSlash[1], 10);
    const c = parseInt(partsSlash[2], 10);
    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
      if (a > 12) {
        return { day: a, month: b, year: normalizeYear(c) };
      } else if (b > 12) {
        return { day: b, month: a, year: normalizeYear(c) };
      } else {
        return { day: a, month: b, year: normalizeYear(c) };
      }
    }
  }
  const iso = sepText.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return {
      day: parseInt(iso[3], 10),
      month: parseInt(iso[2], 10),
      year: parseInt(iso[1], 10),
    };
  }
  const monthNames = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  const tokens = sepText.split(" ");
  if (tokens.length >= 2) {
    for (let i = 0; i < tokens.length; i++) {
      const tkn = tokens[i].toLowerCase();
      if (monthNames[tkn]) {
        const month = monthNames[tkn];
        // try formats like: "26 November 2025" or "November 26 25"
        const nums = tokens
          .filter((x) => !isNaN(parseInt(x, 10)))
          .map((x) => parseInt(x, 10));
        if (nums.length >= 1) {
          const day = nums[0];
          const year = nums[1]
            ? normalizeYear(nums[1])
            : new Date().getFullYear();
          return { day, month, year };
        }
      }
    }
  }
  return null;
}

function normalizeYear(y) {
  if (y < 100) {
    return 2000 + y; // e.g. 25 → 2025
  }
  return y;
}

/* ---------- Dropdown population ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const daySel = document.getElementById("daySel");
  const monthSel = document.getElementById("monthSel");
  const yearSel = document.getElementById("yearSel");

  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    daySel.appendChild(opt);
  }
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthSel.appendChild(opt);
  }
  for (let y = 2020; y <= 2035; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }
});

/* ---------- OPTIONAL: typewriter & confetti placeholders ---------- */
function typeWriter(el, speed) {
  const txt = el.textContent;
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (i < txt.length) {
      el.textContent += txt.charAt(i);
      i++;
      setTimeout(tick, speed);
    }
  };
  tick();
}

function launchConfetti() {
  // empty function for now so page doesn’t error
  // note: https://codepen.io/3Diversity-com/pen/raVjjrN is good, optimized confetti code
  //       that has no JS!
}
