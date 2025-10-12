<template>
  <div class="main-page">
    <!-- ✅ 1. Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="headline">Dev. Dot. Done</h1>
        <p class="subtext">
          개발자와 디자이너가 함께 만드는 협업 플랫폼.<br />
          아이디어가 현실이 되는 순간을 경험하세요.
        </p>

        <div class="hero-buttons">
          <button class="btn primary">프로젝트 시작하기</button>
          <button class="btn secondary">탐색하기</button>
        </div>
      </div>

      <div class="hero-bg">
        <div class="bg-placeholder">[배경 이미지 자리]</div>
      </div>
    </section>

    <!-- ✅ 2. Feature Section -->
    <section class="features">
      <h2 class="section-title">DDD에서는 이런 걸 할 수 있어요</h2>
      <div class="feature-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="icon-placeholder">🔹</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ✅ 3. Project Preview Section -->
    <section class="projects">
      <h2 class="section-title">🔥 지금 주목받는 프로젝트</h2>
      <div class="project-list">
        <div class="project-card" v-for="(project, index) in limitedProjects" :key="index">
          <h3 class="project-title">{{ project.projectTitle }}</h3>
          <p class="project-desc">{{ project.projectContent }}</p>
          <div class="project-meta">
            <span class="member-count">👥 {{ project.memberCount }}명 참여</span>
            <button class="view-btn">자세히 보기</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ 4. CTA Section -->
    <section class="cta">
      <h2>지금, 당신의 프로젝트를 시작하세요.</h2>
      <button class="btn large">프로젝트 만들기</button>
    </section>

    <!-- ✅ 5. Footer -->
    <footer class="footer">
      <p>© 2025 DevDotDone | Together, we make ideas real.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    title: "프로젝트 관리",
    desc: "마일스톤, 일정, 회고를 한 곳에서 관리하세요.",
  },
  {
    title: "팀 협업",
    desc: "역할 부여와 초대를 통해 효율적인 협업을 경험하세요.",
  },
  {
    title: "회고 시스템",
    desc: "프로젝트 회고로 팀의 성장과 개선을 이어가세요.",
  },
  {
    title: "탐색",
    desc: "나와 맞는 프로젝트와 멤버를 손쉽게 찾아보세요.",
  },
]);

const limitedProjects = ref([
  {
    projectId: 1,
    projectTitle: "AI 기반 코드 리뷰 플랫폼",
    projectContent: "AI를 활용해 코드 품질을 자동 분석하고 리뷰하는 서비스.",
    memberCount: 5,
  },
  {
    projectId: 2,
    projectTitle: "스터디 관리 서비스",
    projectContent: "모임 일정, 회고, 출석까지 한 번에 관리하는 플랫폼.",
    memberCount: 8,
  },
  {
    projectId: 3,
    projectTitle: "UI 컴포넌트 라이브러리",
    projectContent: "팀 공통 디자인 시스템을 구축하기 위한 컴포넌트 모음.",
    memberCount: 4,
  },
  {
    projectId: 4,
    projectTitle: "DevDotDone 공식 웹사이트",
    projectContent: "DDD의 모든 기능과 문화를 한눈에 소개하는 웹사이트.",
    memberCount: 6,
  },
]);
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #222;
  font-family: "Pretendard", sans-serif;
}

/* 🟣 1. Hero Section */
.hero {
  position: relative;
  width: 100%;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #6759f4, #8d7ffb);
  overflow: hidden;
}

.hero-content {
  z-index: 2;
}

.bg-placeholder {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  line-height: 200px;
  color: rgba(255, 255, 255, 0.4);
}

.headline {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.subtext {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 30px;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
  cursor: pointer;
}

.btn.primary {
  background: white;
  color: #6759f4;
}

.btn.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

/* 🟣 2. Feature Section */
.features {
  padding: 100px 0;
  text-align: center;
  background: #fafafa;
  width: 100%;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 40px;
}

.feature-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.feature-card {
  width: 220px;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon-placeholder {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

/* 🟣 3. Project Preview */
.projects {
  padding: 100px 0;
  width: 100%;
  text-align: center;
}

.project-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.project-card {
  background: white;
  border-radius: 16px;
  width: 280px;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.project-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.project-desc {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 15px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-btn {
  font-size: 0.85rem;
  color: #6759f4;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

/* 🟣 4. CTA */
.cta {
  width: 100%;
  padding: 100px 0;
  text-align: center;
  background: linear-gradient(135deg, #6759f4, #8d7ffb);
  color: white;
}

.btn.large {
  padding: 14px 32px;
  font-size: 1.1rem;
  background: white;
  color: #6759f4;
  border: none;
}

/* 🟣 5. Footer */
.footer {
  background: #111;
  color: #aaa;
  width: 100%;
  text-align: center;
  padding: 30px 0;
  font-size: 0.85rem;
}
</style>
