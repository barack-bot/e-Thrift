// Entry point (initializes DB, loads .env keys, sets up HTTP server)
package main

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
)

// Category defines the structure for our frontend navigation grid
type Category struct {
	Icon  string
	Label string
	Href  string
}

// renderTemplate handles stitching the layout components and views together with data
func renderTemplate(w http.ResponseWriter, view string, data interface{}) {
	// Target the layout files and the specific page view file
	// Target the base layout, navigation, footer, and the specific page view file
	files := []string{
		filepath.Join("web", "templates", "layouts", "base.html"),
		filepath.Join("web", "templates", "layouts", "navigation.html"),
		filepath.Join("web", "templates", "layouts", "footer.html"),
		filepath.Join("web", "templates", "views", view),
	}

	// Rename "range" to "loop" to avoid the syntax clash
	funcMap := template.FuncMap{
		"loop": func(n int) []int {
			res := make([]int, n)
			for i := range res {
				res[i] = i
			}
			return res
		},
	}

	tmpl, err := template.New(view).Funcs(funcMap).ParseFiles(files...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Template parsing error: %v", err), http.StatusInternalServerError)
		return
	}

	// Execute the primary wrapper layout ("base.html") and inject the dataset
	err = tmpl.ExecuteTemplate(w, "base.html", data)
	if err != nil {
		http.Error(w, fmt.Sprintf("Template execution error: %v", err), http.StatusInternalServerError)
	}
}

func main() {
	// 1. Map asset requests for /static/... directly to your web/static directory
	fs := http.FileServer(http.Dir("web/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// 2. Route the home directory to render index.html with dynamic categories data
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		// Define the structure mapping your Kenyan e-Thrift categories items
		homepageData := struct {
			Categories []Category
		}{
			Categories: []Category{
				{Icon: "fas fa-male", Label: "Men", Href: "/category/men"},
				{Icon: "fas fa-female", Label: "Women", Href: "/category/women"},
				{Icon: "fas fa-child", Label: "Kids", Href: "/category/kids"},
				{Icon: "fas fa-glasses", Label: "Accessories", Href: "/category/accessories"},
				{Icon: "fas fa-shoe-prints", Label: "Shoes", Href: "/category/shoes"},
				{Icon: "fas fa-shopping-bag", Label: "Bags", Href: "/category/bags"},
			},
		}

		renderTemplate(w, "index.html", homepageData)
	})

	// 3. Bind the server instance locally to port 8080
	fmt.Println("Server running smoothly! Access your site at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
