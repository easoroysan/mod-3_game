class StaticController < ActionController::Base

    def react_app
        render :file => 'public/index.html'
    end

end