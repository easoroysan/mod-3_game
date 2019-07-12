class SavefilesController < ApplicationController

    def index
        render json: Savefile.all, methods: [:user]
    end

    def create
        save_file = Savefile.create(allowed_params)
        render json: save_file, methods: [:user]
    end

    def show
        render json: Savefile.find(params[:id]), methods: [:user]
    end

    def update
        save_file = Savefile.find(params[:id])
        save_file.update(allowed_params)
        render json: save_file, methods: [:user]
    end

    def destroy
        save_file = Savefile.find(params[:id])
        save_file.destroy
    end

    private

    def allowed_params
        params.permit(
            :user_id,
            :level,
            :time,
            :health
        )
    end

end