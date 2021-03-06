var ControllerSystem = System.extend({
  init: function(aEntityManager, aLayers){
    this._super(aEntityManager, aLayers);
    this._componentName = 'ControllerComponent';
    this._gamepadSupportAvailable = Modernizr.gamepads;
  },
  addCamera: function(camera){
    this._camera = camera;
  },  
  addMap: function(map){
    this._map = map;
  },  
  update: function(deltaTime, action, messages, camara){
    if(action == null) return;

    entitiesWithController = this._entityManager.getEntitiesForComponent(this._componentName);
    for(entityId in entitiesWithController)
    {
      controllerComponent = this._entityManager.getComponentForEntity(this._componentName, entityId);
      positionComponent   = this._entityManager.getComponentForEntity('PositionComponent', entityId);
      movementComponent   = this._entityManager.getComponentForEntity('MovementComponent', entityId);
      rendererComponent   = this._entityManager.getComponentForEntity('RenderComponent', entityId);
      if(
        controllerComponent != null && 
        positionComponent != null && 
        movementComponent != null && 
        rendererComponent != null
      ){
        movementDelta =  Math.floor(movementComponent.speed * deltaTime);
        switch(action)
        {
          case controllerComponent.upKey():
            if(positionComponent.y >= movementDelta){
              positionComponent.y -= movementDelta;
              
              messages.add('console', 
                'Move <b>Entity [' + entityId + 
                '] up</b> by [' + movementDelta + 
                '] to [' + positionComponent.toString() + ']');            
            }
            if(this._camera.topEdge() >= movementDelta){
              if(positionComponent.y <= this._camera.paddedTopEdge())
              {
                this._camera.move(0, -1 * movementDelta);
              }
            }
            break;        
          case controllerComponent.downKey():
            if(positionComponent.y < (this._map.height() - rendererComponent.sprite.height)){
              positionComponent.y += movementDelta;
              messages.add('console', 
                'Move <b>Entity [' + entityId + 
                '] down</b> by [' + movementDelta + 
                '] to [' + positionComponent.toString() + ']');            
            }
            if(this._camera.topEdge() < (this._map.height() - this._camera.height())){
              if(positionComponent.y >= this._camera.paddedBottomEdge())
              {
                this._camera.move(0, movementDelta);
              }
            }
            break;
          case controllerComponent.leftKey():
            if(positionComponent.x >= movementDelta){
              positionComponent.x -= movementDelta;
              messages.add('console', 
                'Move <b>Entity [' + entityId + 
                '] left</b> by [' + movementDelta + 
                '] to [' + positionComponent.toString() + ']');
            }
            if(this._camera.leftEdge() >= movementDelta)
            {
              if(positionComponent.x <= this._camera.paddedLeftEdge())
              {
                this._camera.move(-1 * movementDelta, 0);              
              }
            }
            break;
          case controllerComponent.rightKey():
            if(positionComponent.x < (this._map.width() - rendererComponent.sprite.width)){
              positionComponent.x += movementDelta;
              messages.add('console', 
                'Move <b>Entity [' + entityId + 
                '] right</b> by [' + movementDelta + 
                '] to [' + positionComponent.toString() + ']');
            }
            if(this._camera.rightEdge() < (this._map.width() - this._camera.width())){
              if(positionComponent.x >= this._camera.paddedRightEdge())
              {
                this._camera.move(movementDelta, 0);
              }
            }
            break;
          case controllerComponent.secondaryActionKey():
            positionComponent.reinit();
            this._camera.center(positionComponent, this._map);
            messages.add('console', 
              'Activate <b>Entity [' + entityId + ']</b> secondary action');
            break;
          case controllerComponent.primaryActionKey():
            positionComponent.reinit();
            this._camera.center(positionComponent, this._map);
            messages.add('console', 
              'Activate <b>Entity [' + entityId + ']</b> primary action');
            break;
          default:
            break;
        }
      }
    }

  },
});