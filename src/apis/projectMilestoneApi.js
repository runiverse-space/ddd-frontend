import axios from "axios";
import "./axiosConfig";

/** ✅ 마일스톤 생성 */
function createProjectMilestone(projectMilestone) {
  return axios.post("/api/projectmilestone/create", projectMilestone);
}

/** ✅ 프로젝트별 마일스톤 목록 조회 */
function getProjectMilestones(projectId) {
  return axios.get("/api/projectmilestone/list", { params: { projectId } });
}

/** ✅ 단일 마일스톤 상세 조회 */
function getProjectMilestoneDetail(milestoneId) {
  return axios.get("/api/projectmilestone/detail", { params: { milestoneId } });
}

/** ✅ 마일스톤 수정 */
function updateProjectMilestone(projectMilestone) {
  return axios.put("/api/projectmilestone/update", projectMilestone);
}

/** ✅ 마일스톤 삭제 */
function deleteProjectMilestone(milestoneId) {
  return axios.delete("/api/projectmilestone/delete", {
    params: { milestoneId },
  });
}

export default {
  createProjectMilestone,
  getProjectMilestones,
  getProjectMilestoneDetail,
  updateProjectMilestone,
  deleteProjectMilestone,
};
