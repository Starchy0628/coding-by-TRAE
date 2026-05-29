# 眼动交互网页 - 产品需求文档

## Overview
- **Summary**: 创建一个眼动交互网页，实时显示用户注意力数值，根据用户视线是否在AOI（感兴趣区域）内来增减数值。
- **Purpose**: 通过眼动追踪技术，实时监测用户注意力，为用户提供视觉反馈。
- **Target Users**: 需要进行注意力监测的用户，如研究人员、培训师或普通用户。

## Goals
- 显示用户注意力数值，初始值为0
- 视线在AOI区域内时，数值以每秒5个单位上升
- 视线不在AOI区域内时，数值以每秒10个单位下降
- AOI区域为上传图片中心点为圆心、半径100的圆

## Non-Goals (Out of Scope)
- 不实现真实的眼动硬件追踪功能
- 不保存用户注意力数据
- 不提供数据导出功能
- 不支持多AOI区域

## Background & Context
- 用户上传了一张猫咪图片作为参考
- 使用鼠标位置模拟眼动追踪（因为没有真实眼动硬件）
- AOI区域基于图片中心点计算

## Functional Requirements
- **FR-1**: 页面显示用户注意力数值，初始值为0
- **FR-2**: 当鼠标（模拟视线）在AOI区域内时，数值每秒上升5个单位
- **FR-3**: 当鼠标（模拟视线）不在AOI区域内时，数值每秒下降10个单位
- **FR-4**: AOI区域为图片中心点为圆心、半径100的圆，在页面上可视化显示
- **FR-5**: 显示上传的图片

## Non-Functional Requirements
- **NFR-1**: 数值更新流畅，无明显卡顿
- **NFR-2**: 页面响应迅速，鼠标移动实时反映
- **NFR-3**: 视觉效果清晰，AOI区域明显可见

## Constraints
- **Technical**: 使用Web技术（HTML/CSS/JavaScript）实现
- **Business**: 无特殊商业约束
- **Dependencies**: 无外部依赖

## Assumptions
- 由于没有眼动硬件，使用鼠标位置模拟视线位置
- 用户上传的图片将被正确加载和显示
- 注意力数值范围为0-100

## Acceptance Criteria

### AC-1: 初始注意力数值显示
- **Given**: 用户打开网页
- **When**: 页面加载完成
- **Then**: 注意力数值显示为0
- **Verification**: `programmatic`
- **Notes**: 数值显示在页面显眼位置

### AC-2: AOI区域内数值上升
- **Given**: 用户将鼠标移动到AOI区域内
- **When**: 鼠标保持在AOI区域内超过1秒
- **Then**: 注意力数值增加5个单位
- **Verification**: `programmatic`

### AC-3: AOI区域外数值下降
- **Given**: 用户将鼠标移动到AOI区域外
- **When**: 鼠标保持在AOI区域外超过1秒
- **Then**: 注意力数值减少10个单位
- **Verification**: `programmatic`

### AC-4: AOI区域可视化
- **Given**: 页面加载完成
- **When**: 图片显示
- **Then**: 在图片中心显示一个半径100px的圆形AOI区域
- **Verification**: `human-judgment`

### AC-5: 数值范围限制
- **Given**: 注意力数值达到边界
- **When**: 数值上升超过100或下降低于0
- **Then**: 数值保持在0-100范围内
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要添加开始/暂停按钮？
- [ ] 是否需要添加数值上限和下限？（默认假设为0-100）