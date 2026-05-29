# 眼动交互网页 - 实现计划（分解和优先级任务列表）

## [ ] Task 1: 创建HTML页面结构
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建基础HTML页面
  - 添加图片显示区域
  - 添加注意力数值显示区域
  - 引入用户上传的猫咪图片
- **Acceptance Criteria Addressed**: [AC-1, AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-1.1: 页面加载后显示注意力数值为0
  - `human-judgement` TR-1.2: 页面布局合理，图片和数值显示清晰
- **Notes**: 使用用户上传的猫咪图片

## [ ] Task 2: 实现AOI区域可视化
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 计算图片中心点坐标
  - 在图片中心绘制半径100px的圆形AOI区域
  - AOI区域用半透明颜色标识
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-2.1: AOI圆形区域显示在图片中心位置
  - `human-judgement` TR-2.2: AOI区域半径看起来约为100px
- **Notes**: 使用CSS或Canvas绘制AOI区域

## [ ] Task 3: 实现鼠标位置追踪
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 监听鼠标移动事件
  - 获取鼠标相对于图片的坐标
  - 判断鼠标是否在AOI圆形区域内
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-3.1: 鼠标进入AOI区域时正确检测
  - `programmatic` TR-3.2: 鼠标离开AOI区域时正确检测
- **Notes**: 使用勾股定理计算点到圆心的距离

## [ ] Task 4: 实现注意力数值计算逻辑
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 设置定时器每秒更新数值
  - 在AOI区域内：每秒+5
  - 在AOI区域外：每秒-10
  - 限制数值在0-100范围内
- **Acceptance Criteria Addressed**: [AC-2, AC-3, AC-5]
- **Test Requirements**:
  - `programmatic` TR-4.1: 鼠标在AOI内停留1秒，数值增加5
  - `programmatic` TR-4.2: 鼠标在AOI外停留1秒，数值减少10
  - `programmatic` TR-4.3: 数值不会超过100或低于0
- **Notes**: 使用setInterval实现每秒更新

## [ ] Task 5: 实现数值显示更新
- **Priority**: P1
- **Depends On**: Task 4
- **Description**: 
  - 将计算的数值实时更新到页面显示
  - 添加数值变化的视觉反馈效果
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 数值变化实时显示
  - `human-judgement` TR-5.2: 数值显示清晰易读
- **Notes**: 可以添加颜色变化或动画效果