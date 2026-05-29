class EyeTrackingApp {
    constructor() {
        this.attentionValue = 0;
        this.maxValue = 100;
        this.minValue = 0;
        this.aoiRadius = 100;
        this.isTracking = false;
        this.updateInterval = null;
        this.aoiCenter = { x: 0, y: 0 };
        this.dataLog = [];
        this.sessionStartTime = null;
        
        this.gazeIndicator = document.getElementById('gaze-indicator');
        this.attentionDisplay = document.getElementById('attention-value');
        this.progressFill = document.getElementById('progress-fill');
        this.imageContainer = document.getElementById('image-container');
        this.aoiCircle = document.getElementById('aoi-circle');
        this.statusText = document.getElementById('status-text');
        this.gazeCoords = document.getElementById('gaze-coords');
        
        this.init();
    }
    
    init() {
        this.setupAOI();
        this.setupEventListeners();
        this.configureWebGazer();
    }
    
    setupAOI() {
        const rect = this.imageContainer.getBoundingClientRect();
        this.aoiCenter.x = rect.width / 2;
        this.aoiCenter.y = rect.height / 2;
        
        this.aoiCircle.style.width = `${this.aoiRadius * 2}px`;
        this.aoiCircle.style.height = `${this.aoiRadius * 2}px`;
        this.aoiCircle.style.left = `${this.aoiCenter.x - this.aoiRadius}px`;
        this.aoiCircle.style.top = `${this.aoiCenter.y - this.aoiRadius}px`;
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startTracking());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopTracking());
        document.getElementById('calibrate-btn').addEventListener('click', () => this.calibrate());
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearData());
        
        window.addEventListener('resize', () => this.setupAOI());
    }
    
    configureWebGazer() {
        webgazer.setRegression('ridge');
        webgazer.setTracker('TFFacemesh');
        webgazer.saveDataAcrossSessions = true;
        webgazer.showVideo(false);
        
        webgazer.setGazeListener((data, elapsedTime) => {
            if (!this.isTracking || data == null) return;
            
            const x = data.x;
            const y = data.y;
            
            this.updateGazeIndicator(x, y);
            this.updateGazeCoords(x, y);
        });
    }
    
    startTracking() {
        if (this.isTracking) return;
        
        this.isTracking = true;
        this.statusText.textContent = '追踪中';
        this.statusText.style.background = '#e8f5e9';
        this.statusText.style.color = '#2e7d32';
        this.sessionStartTime = Date.now();
        this.dataLog = [];
        
        webgazer.begin()
            .then(() => {
                this.startAttentionUpdate();
                this.gazeIndicator.style.opacity = '1';
            })
            .catch((err) => {
                console.error('启动失败:', err);
                this.statusText.textContent = '启动失败';
                this.statusText.style.background = '#ffebee';
                this.statusText.style.color = '#c62828';
                this.isTracking = false;
            });
    }
    
    stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        webgazer.pause();
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.statusText.textContent = '已停止';
        this.statusText.style.background = '#fff3e0';
        this.statusText.style.color = '#e65100';
        this.gazeIndicator.style.opacity = '0';
    }
    
    calibrate() {
        webgazer.clearData();
        this.statusText.textContent = '请点击页面进行校准';
        this.statusText.style.background = '#e3f2fd';
        this.statusText.style.color = '#1565c0';
    }
    
    startAttentionUpdate() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            if (!this.isTracking) return;
            
            const prediction = webgazer.getCurrentPrediction();
            
            if (prediction) {
                const x = prediction.x;
                const y = prediction.y;
                
                if (this.isInsideAOI(x, y)) {
                    this.attentionValue = Math.min(this.maxValue, this.attentionValue + 5);
                } else {
                    this.attentionValue = Math.max(this.minValue, this.attentionValue - 10);
                }
                
                this.updateDisplay();
            }
        }, 1000);
    }
    
    isInsideAOI(x, y) {
        const rect = this.imageContainer.getBoundingClientRect();
        const containerX = this.imageContainer.offsetLeft + window.scrollX;
        const containerY = this.imageContainer.offsetTop + window.scrollY;
        
        const relativeX = x - containerX;
        const relativeY = y - containerY;
        
        const distance = Math.sqrt(
            Math.pow(relativeX - this.aoiCenter.x, 2) +
            Math.pow(relativeY - this.aoiCenter.y, 2)
        );
        
        return distance <= this.aoiRadius;
    }
    
    updateGazeIndicator(x, y) {
        const rect = this.imageContainer.getBoundingClientRect();
        const containerX = this.imageContainer.offsetLeft + window.scrollX;
        const containerY = this.imageContainer.offsetTop + window.scrollY;
        
        const relativeX = x - containerX;
        const relativeY = y - containerY;
        
        if (relativeX >= 0 && relativeX <= rect.width && 
            relativeY >= 0 && relativeY <= rect.height) {
            this.gazeIndicator.style.left = `${relativeX}px`;
            this.gazeIndicator.style.top = `${relativeY}px`;
            this.gazeIndicator.style.opacity = '1';
        } else {
            this.gazeIndicator.style.opacity = '0.3';
        }
    }
    
    updateGazeCoords(x, y) {
        this.gazeCoords.textContent = `注视位置: (${Math.round(x)}, ${Math.round(y)})`;
    }
    
    updateDisplay() {
        this.attentionDisplay.textContent = Math.round(this.attentionValue);
        this.progressFill.style.width = `${this.attentionValue}%`;
        
        const prediction = webgazer.getCurrentPrediction();
        if (prediction && this.isTracking) {
            this.dataLog.push({
                timestamp: Date.now(),
                attentionValue: Math.round(this.attentionValue),
                gazeX: Math.round(prediction.x),
                gazeY: Math.round(prediction.y),
                isInsideAOI: this.isInsideAOI(prediction.x, prediction.y)
            });
        }
    }
    
    exportData() {
        const exportData = {
            sessionStartTime: this.sessionStartTime,
            exportTime: Date.now(),
            totalSamples: this.dataLog.length,
            data: this.dataLog
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eye-tracking-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.statusText.textContent = '数据已导出';
        this.statusText.style.background = '#e8f5e9';
        this.statusText.style.color = '#2e7d32';
    }
    
    clearData() {
        this.dataLog = [];
        this.sessionStartTime = null;
        this.statusText.textContent = '数据已清除';
        this.statusText.style.background = '#fff3e0';
        this.statusText.style.color = '#e65100';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EyeTrackingApp();
});