class Viewer

  constructor: (@dom) ->
    @time = 0.0
    @renderer = new THREE.WebGLRenderer(antialias: true)
    @dom.appendChild(@renderer.domElement)
    @scene = new THREE.Scene()
    @camera = new THREE.PerspectiveCamera(35, @dom.clientWidth/@dom.clientHeight, 1, 3000)
    @controls = new THREE.OrbitControls(@camera, @dom)
    @scene.add(@camera)
    @loader = new THREE.JSONLoader()
    @material = @defaultMaterial()
    @loadModel('models/monkey_high.js')
    @onResize()
    window.addEventListener('resize', (() => @onResize()), off)

  update: ->
    @controls.update()
    @time += 0.001
    @uniforms.time.value = @time
    @model.rotation.y = @time*5 if @model
    @renderer.render(@scene, @camera)

  onResize: ->
    if @camera
      @camera.aspect = @dom.clientWidth/@dom.clientHeight
      @camera.updateProjectionMatrix()
      @camera.position.z = 900/@dom.clientWidth*4
      @camera.lookAt(@scene.position)
    if @uniforms
      @uniforms.resolution.value.x = @dom.clientWidth
      @uniforms.resolution.value.y = @dom.clientHeight
    @renderer.setSize(@dom.clientWidth, @dom.clientHeight)

  loadModel: (key) ->
    @loader.load(key, ((geo) => 
      @initModel(geo, key)
    ))

  initModel: (geo, key) ->
    data = shdr.Models[key]
    if @model?
      old = @model.geometry
      @scene.remove(@model)
      old.dispose()
    @model = new THREE.Mesh(geo, @material)
    if data?
      @model.scale.set(data.scale, data.scale, data.scale) if data.scale?
    @scene.add(@model)

  updateShader: (fs) ->
    @fs = fs
    @material.fragmentShader = fs
    @material.needsUpdate = true

  defaultMaterial: ->
    @uniforms = {
      time: {type: 'f', value: 0.0}
      resolution: {type: 'v2', value: new THREE.Vector2(@dom.clientWidth, @dom.clientHeight)}
    }
    @vs = [
      'varying vec3 fNormal;'
      'varying vec3 fPosition;'
      'void main()'
      '{'
      'fNormal = normalize(normalMatrix * normal);'
      'fPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;'
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);'
      '}'
    ].join("\n")
    @fs = [
      'uniform float time;'
      'uniform vec2 resolution;'
      'varying vec3 fPosition;'
      'varying vec3 fNormal;'
      'void main()'
      '{'
      '  gl_FragColor = vec4(fNormal, 1.0);'
      '}'
    ].join("\n")
    return new THREE.ShaderMaterial(
      uniforms: @uniforms
      vertexShader: @vs
      fragmentShader: @fs
    )

@shdr ||= {}
@shdr.Viewer = Viewer