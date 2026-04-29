// Grade distribution data for each course
const gradeDataMap = {
'ELEG1001': { values: [8, 3, 12, 14, 9, 20], myGrade: 'A' },
'IMAG1002': { values: [15, 18, 23, 33, 44, 52], myGrade: 'A' },
'IELEG1040': { values: [9, 24, 8, 4, 1, 2], myGrade: 'A' },
'REA0012': { values: [14, 15, 12, 17, 9, 10], myGrade: 'A' }
};

function initGradeChart() {
// Find all grade chart canvases on the page
const canvases = document.querySelectorAll('canvas[id^="gradePopupChart"]');

canvases.forEach((ctx) => {
if (!ctx) return;

// Determine which course this canvas belongs to
let courseData = gradeDataMap['ELEG1001']; // default
const container = ctx.closest('.grade-badge-container');
const courseHeader = container?.closest('.topic-item')?.querySelector('h3');

if (courseHeader) {
const headerText = courseHeader.textContent || courseHeader.innerText || '';
for (const [course, data] of Object.entries(gradeDataMap)) {
if (headerText.includes(course)) {
courseData = data;
break;
}
}
}

if (typeof Chart === 'undefined') {
drawFallbackChart(ctx, courseData);
return;
}

const gradeLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
const myGradeIndex = gradeLetters.indexOf(courseData.myGrade);
const labels = gradeLetters;
const values = courseData.values;

const chartConfig = {
type: 'bar',
data: {
labels,
datasets: [{
label: 'Karakterfordeling',
data: values,
backgroundColor: labels.map((_, i) => (
i === myGradeIndex ? 'rgba(34, 197, 94, 0.9)' : 'rgba(242, 242, 239, 0.16)'
)),
borderColor: labels.map((_, i) => (
i === myGradeIndex ? 'rgba(34, 197, 94, 1)' : 'rgba(242, 242, 239, 0.24)'
)),
borderWidth: 2,
borderRadius: 6,
hoverBackgroundColor: labels.map((_, i) => (
i === myGradeIndex ? 'rgba(34, 197, 94, 0.9)' : 'rgba(242, 242, 239, 0.16)'
)),
hoverBorderColor: labels.map((_, i) => (
i === myGradeIndex ? 'rgba(34, 197, 94, 1)' : 'rgba(242, 242, 239, 0.24)'
)),
}]
},
options: {
indexAxis: 'x',
responsive: true,
maintainAspectRatio: false,
events: [],
animation: {
duration: 700
},
plugins: {
legend: {
display: false
},
tooltip: {
enabled: false
}
},
scales: {
y: {
ticks: {
color: '#9c9c9c',
font: { size: 12 },
stepSize: 5
},
beginAtZero: true,
max: Math.ceil(Math.max(...values) / 10) * 10,
grid: {
color: 'rgba(242, 242, 239, 0.08)',
drawBorder: false
}
},
x: {
ticks: {
color: (tickContext) => (
tickContext.index === myGradeIndex ? '#22c55e' : '#9c9c9c'
),
font: { size: 12, weight: 'bold' }
},
grid: {
display: false,
drawBorder: false
}
}
}
}
};

new Chart(ctx, chartConfig);
});
}

function drawFallbackChart(canvas, courseData) {
const gradeLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
const myGradeIndex = gradeLetters.indexOf(courseData.myGrade);
const labels = gradeLetters;
const values = courseData.values;

const dpr = window.devicePixelRatio || 1;
const width = Math.max(canvas.clientWidth, 320);
const height = Math.max(canvas.clientHeight, 260);

canvas.width = Math.floor(width * dpr);
canvas.height = Math.floor(height * dpr);

const c = canvas.getContext('2d');
if (!c) return;
c.setTransform(dpr, 0, 0, dpr, 0, 0);

const pad = { top: 16, right: 18, bottom: 40, left: 36 };
const chartW = width - pad.left - pad.right;
const chartH = height - pad.top - pad.bottom;
const max = Math.ceil(Math.max(...values) / 10) * 10;
const step = chartW / labels.length;
const barW = Math.min(54, step * 0.62);

c.clearRect(0, 0, width, height);

// Grid lines.
c.strokeStyle = 'rgba(242, 242, 239, 0.12)';
c.lineWidth = 1;
for (let i = 0; i <= 4; i += 1) {
const y = pad.top + (chartH / 4) * i;
c.beginPath();
c.moveTo(pad.left, y);
c.lineTo(width - pad.right, y);
c.stroke();
}

// Y-axis numbering.
c.fillStyle = '#9c9c9c';
c.font = '500 12px Segoe UI, Arial, sans-serif';
c.textAlign = 'right';
for (let i = 0; i < 4; i += 1) {
const value = max - (i * (max / 4));
const y = pad.top + (chartH / 4) * i + 4;
c.fillText(String(Math.round(value)), pad.left - 8, y);
}

// Bars + labels.
c.font = '600 13px Segoe UI, Arial, sans-serif';
c.textAlign = 'center';
for (let i = 0; i < labels.length; i += 1) {
const value = values[i];
const x = pad.left + step * i + (step - barW) / 2;
const barH = (value / max) * chartH;
const y = pad.top + chartH - barH;

c.fillStyle = i === myGradeIndex ? 'rgba(34, 197, 94, 0.9)' : 'rgba(242, 242, 239, 0.18)';
c.fillRect(x, y, barW, barH);

c.strokeStyle = i === myGradeIndex ? 'rgba(34, 197, 94, 1)' : 'rgba(242, 242, 239, 0.26)';
c.strokeRect(x + 0.5, y + 0.5, barW - 1, barH - 1);

c.fillStyle = '#f2f2ef';
c.fillText(String(value), x + barW / 2, Math.max(14, y - 6));

c.fillStyle = i === myGradeIndex ? '#22c55e' : '#9c9c9c';
c.fillText(labels[i], x + barW / 2, height - 14);
}
}

document.addEventListener('DOMContentLoaded', initGradeChart);

function initGradePopup() {
const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!isDesktopPointer) return;

// Handle all grade badge containers on the page
const containers = document.querySelectorAll('.grade-badge-container');

containers.forEach((container) => {
const badge = container.querySelector('.course-grade');
if (!badge) return;
let closeTimer = null;

const openPopup = () => {
if (closeTimer) {
clearTimeout(closeTimer);
closeTimer = null;
}
container.classList.add('is-open');
};

const closePopup = () => {
closeTimer = setTimeout(() => {
container.classList.remove('is-open');
}, 90);
};

badge.addEventListener('mouseenter', openPopup);
badge.addEventListener('mouseleave', closePopup);
badge.addEventListener('focus', openPopup);
badge.addEventListener('blur', closePopup);
});
}

document.addEventListener('DOMContentLoaded', initGradePopup);
