<?php
/**
 * BloodWeb Version Manager
 * Handles version information and updates
 */

class VersionManager {
    private $versionFile;
    public $data;
    
    public function __construct($versionFile = null) {
        $this->versionFile = $versionFile ?: __DIR__ . '/version.json';
        $this->load();
    }
    
    private function load() {
        if (file_exists($this->versionFile)) {
            $this->data = json_decode(file_get_contents($this->versionFile), true);
        } else {
            // Default structure
            $this->data = [
                'version' => '0.0.0',
                'build' => 0,
                'release_date' => date('Y-m-d'),
                'environment' => 'unknown',
                'changelog' => []
            ];
        }
    }
    
    public function save() {
        file_put_contents(
            $this->versionFile, 
            json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }
    
    public function getVersion() {
        return $this->data['version'];
    }
    
    public function getBuild() {
        return $this->data['build'];
    }
    
    public function getFullVersion() {
        return $this->data['version'] . '.' . $this->data['build'];
    }
    
    public function getReleaseDate() {
        return $this->data['release_date'];
    }
    
    public function getEnvironment() {
        return $this->data['environment'];
    }
    
    public function getCodename() {
        return isset($this->data['codename']) ? $this->data['codename'] : 'Unknown';
    }
    
    public function setCodename($codename) {
        $this->data['codename'] = $codename;
        $this->save();
    }
    
    public function getChangelog($limit = null) {
        if ($limit) {
            return array_slice($this->data['changelog'], 0, $limit);
        }
        return $this->data['changelog'];
    }
    
    public function incrementBuild() {
        $this->data['build']++;
        $this->data['release_date'] = date('Y-m-d H:i:s');
        $this->save();
        return $this->data['build'];
    }
    
    public function setBuild($build) {
        $this->data['build'] = (int)$build;
        $this->data['release_date'] = date('Y-m-d H:i:s');
        $this->save();
    }
    
    public function setVersion($version) {
        $this->data['version'] = $version;
        $this->save();
    }
    
    public function addChangelogEntry($version, $changes) {
        array_unshift($this->data['changelog'], [
            'version' => $version,
            'date' => date('Y-m-d H:i:s'),
            'changes' => $changes
        ]);
        $this->save();
    }
    
    public function getData() {
        return $this->data;
    }
}
